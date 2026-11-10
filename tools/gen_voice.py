import re, os, subprocess, json, shutil, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
PV='/tmp/pv'; OUT=PV+'/public/voice'
os.makedirs(OUT,exist_ok=True)
# voice: (kokoro id, base speed, pitch, energy 0..1, ffmpeg filter chain)
ARENA='acompressor=threshold=-18dB:ratio=3:attack=5:release=80,equalizer=f=3000:t=q:w=1:g=3,aecho=0.85:0.6:70:0.22,volume=1.4'
BOOTH='acompressor=threshold=-18dB:ratio=2.5,aecho=0.85:0.6:45:0.14,volume=1.3'
VOICES={
 'rex':('am_puck',1.18,1.05,1.0,ARENA),
 'tony':('am_adam',1.15,1.06,1.0,ARENA),
 'jet':('am_eric',1.2,1.06,1.0,ARENA),
 'marv':('bm_george',0.94,0.97,0.55,BOOTH),
 'coach':('am_michael',1.0,0.98,0.55,'acompressor=threshold=-20dB:ratio=2.5,aecho=0.8:0.5:30:0.08,volume=1.35'),
 'coachw':('am_michael',0.88,0.95,0.0,'highpass=f=250,lowpass=f=3300,acompressor=threshold=-24dB:ratio=3,volume=0.9'),
 'cheer':('af_jessica',1.22,1.08,1.0,'acompressor=threshold=-16dB:ratio=3,equalizer=f=4000:t=q:w=1:g=3,aecho=0.8:0.6:55:0.18,volume=1.4'),
 'clock':('bm_daniel',0.9,0.93,0.0,'highpass=f=250,lowpass=f=3800,acompressor=threshold=-20dB:ratio=4,volume=1.5'),
 'tyler':('am_liam',1.1,1.07,0.85,'acompressor=threshold=-20dB:ratio=2.5,volume=1.35'),
 'tylerw':('am_liam',0.85,1.0,0.0,'highpass=f=300,lowpass=f=3200,acompressor=threshold=-24dB:ratio=3,volume=0.9'),
 'gary':('am_echo',1.0,0.96,0.25,'acompressor=threshold=-20dB:ratio=2.5,volume=1.35'),
 'brenda':('af_sarah',0.93,1.0,0.4,'acompressor=threshold=-20dB:ratio=2.5,volume=1.4'),
 'wifi':('bf_lily',0.95,1.02,0.25,'acompressor=threshold=-20dB:ratio=2.5,volume=1.4'),
 'pa':('bf_emma',0.92,1.0,0.0,'highpass=f=320,lowpass=f=3300,acompressor=threshold=-20dB:ratio=3,aecho=0.8:0.8:110|230:0.32|0.18,volume=1.5'),
 'robot':('af_nicole',0.94,1.0,0.0,'highpass=f=380,lowpass=f=3200,acompressor=threshold=-20dB:ratio=3,volume=1.5'),
 'cat':('bf_isabella',0.84,0.98,0.0,'aecho=0.8:0.5:35:0.12,volume=1.2'),
}
def fnv(s):
    h=0x811c9dc5
    for b in s.encode('utf-8'): h^=b; h=(h*0x01000193)&0xffffffff
    return format(h,'08x')
STR=r'"((?:[^"\\]|\\.)*)"'
def unesc(t): return t.replace('\\"','"').replace("\\'","'").replace('\\\\','\\')
def arr(src,name):
    m=re.search(r'const '+name+r'\b[^=]*=\s*\[(.*?)\n\]',src,re.S)
    return [unesc(x) for x in re.findall(STR,m.group(1))] if m else []
lines=[]
def add(v,t):
    if (v,t) not in lines: lines.append((v,t))
src=open(PV+'/app/screens/mouse-sports-network/page.tsx').read()
for who,t in re.findall(r'\b([AB])\('+STR,src): add('tony' if who=='B' else 'rex',unesc(t))
src=open(PV+'/app/screens/corner-watch/page.tsx').read()
for who,t in re.findall(r'\b([AB])\('+STR,src): add('marv' if who=='B' else 'jet',unesc(t))
src=open(PV+'/app/screens/focus/lines.ts').read()
for v,t in re.findall(r'\bV\("(\w+)",\s*'+STR+r'\)',src):
    if v in VOICES: add(v,unesc(t))
ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
TENS=['','','twenty','thirty','forty','fifty']
def nw(n): return ONES[n] if n<20 else TENS[n//10]+((' '+ONES[n%10]) if n%10 else '')
pieces=['It is','It was','It is now','and','second','seconds','P M','A M','a moment ago. That was the better one.','You are closer to','than you were.','Distraction detected.']
pieces+= [nw(h) for h in range(1,13)]+["o'clock"]+['oh '+ONES[m] for m in range(1,10)]+[nw(m) for m in range(10,60)]+[nw(x) for x in range(1,60)]
for t in dict.fromkeys(pieces): add('clock',t)
for t in arr(open(PV+'/app/screens/departures-board/page.tsx').read(),'PA'): add('pa',t)
s=open(PV+'/app/screens/on-hold/page.tsx').read()
for n in ('VOICE','BAD_KEY'):
    for t in arr(s,n): add('robot',t)
for t in re.findall(r'\bC\('+STR+r'\)',open(PV+'/app/screens/cats-took-over/page.tsx').read()): add('cat',unesc(t))
ACR={'TV','PA','USA','ID','AI','CPU','RAM','PC','IT','OK','UK','USB','GPU','DVD','PDF','FBI','CIA','NASA','HR','CEO'}
def prep(t): return re.sub(r'\b[A-Z]{3,}\b',lambda m: m.group(0) if m.group(0) in ACR else m.group(0).capitalize(),t)
def mood(sent,energy):
    words=[w for w in re.findall(r"[A-Za-z']+",sent) if len(w)>=3]
    caps=sum(1 for w in words if w.isupper()) 
    shout=words and caps/len(words)>=0.5 and len(words)>=2
    st=sent.strip()
    if energy==0: return (1.0,1.0,0.0)
    if shout: return (1.12,1.07,1.0)
    if st.endswith('!'): return (1.05,1.03,0.6)
    if st.endswith('?'): return (1.0,1.02,0.3)
    if st.endswith('...') or '...' in st: return (0.88,0.98,-0.3)
    return (0.97,1.0,0.0)
print(len(lines),'lines',flush=True)
k=Kokoro('/tmp/work/kk/kokoro.onnx','/tmp/work/kk/voices.bin')
ids=[]
for i,(v,t) in enumerate(lines):
    h=fnv(v+'|'+t); ids.append(h); mp=f'{OUT}/{h}.mp3'
    if os.path.exists(mp): continue
    vid,sp,pt,en,flt=VOICES[v]
    parts=[x for x in re.split(r'(?<=[.!?])\s+',t.strip()) if x]
    chunks=[]; sr=24000
    for sent in parts:
        ms,mp_,_=mood(sent,en)
        speed=sp*(1+(ms-1)*en) if en>0 else sp
        a,sr=k.create(prep(sent),voice=vid,speed=min(1.45,speed),lang='en-us')
        p=pt*(1+(mp_-1)*en) if en>0 else pt
        if abs(p-1)>0.003:
            sf.write('/tmp/work/kk/_a.wav',a,sr)
            subprocess.run(['ffmpeg','-loglevel','error','-y','-i','/tmp/work/kk/_a.wav','-af',f'asetrate={int(sr*p)},aresample={sr},atempo={1/p:.4f}','/tmp/work/kk/_b.wav'],check=True)
            a,_=sf.read('/tmp/work/kk/_b.wav')
        ab=np.abs(a); idx=np.where(ab>0.01)[0]
        if len(idx): a=a[max(0,idx[0]-int(0.015*sr)):idx[-1]+int(0.03*sr)]
        chunks.append(a)
        gap=0.07 if en>0.5 else 0.16
        chunks.append(np.zeros(int(gap*sr)))
    audio=np.concatenate(chunks[:-1]) if chunks else np.zeros(100)
    audio=np.concatenate([audio,np.zeros(int((0.02 if v=='clock' else 0.12)*sr))])
    sf.write('/tmp/work/kk/_t.wav',audio,sr)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i','/tmp/work/kk/_t.wav','-af',flt,'-ac','1','-b:a','48k',mp],check=True)
    print(i+1,len(lines),v,flush=True)
keep=set(i+'.mp3' for i in ids)
for f in os.listdir(OUT):
    if f not in keep: os.remove(os.path.join(OUT,f))
open(PV+'/lib/voice-manifest.ts','w').write('// Generated by tools/gen_voice.py: ids of the pre-rendered clips in /public/voice.\nexport const CLIP_IDS = new Set<string>(' + json.dumps(sorted(set(ids))) + ')\n')
print('done')
