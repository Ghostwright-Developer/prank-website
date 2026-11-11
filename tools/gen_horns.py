import sys; sys.path.insert(0,'/tmp/work')
import numpy as np
from scipy import signal
import crowd as C
import applause as AP
from crowd import SR, save, reverb, norm, interp

def adsr(n,a,r,sus=1.0):
    e=np.ones(n)*sus; ia=int(a*SR); ir=int(r*SR)
    e[:ia]=np.linspace(0,sus,ia); e[-ir:]=np.linspace(sus,0,ir); return e
def osc(f,dur,kind='saw',det=0.0,vib=0.0,vibf=5.0):
    n=int(dur*SR); t=np.arange(n)/SR
    ff=f*(1+det)*(1+vib*np.sin(2*np.pi*vibf*t)) if np.isscalar(f) else f
    ph=np.cumsum(ff/SR)
    if kind=='saw': return 2*(ph%1)-1
    if kind=='sq': return np.sign(np.sin(2*np.pi*ph))
    return np.sin(2*np.pi*ph)
def lp(x,fc,order=2): return signal.sosfilt(signal.butter(order,fc,btype='low',fs=SR,output='sos'),x)
def bp(x,lo,hi): return signal.sosfilt(signal.butter(2,[lo,hi],btype='band',fs=SR,output='sos'),x)

def airhorn_clip(L,wet,rt,pitch=1.0,drop=0.02):
    n=int(L*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for f,g in [(415,1),(494,.9),(622,.9),(207,.7),(830,.35)]:
        ff=f*pitch*(1+0.004*np.sin(2*np.pi*31*t))*(1-drop*(t/L)**3)
        ph=np.cumsum(ff/SR); sq=np.sign(np.sin(2*np.pi*ph))*0.6+(2*(ph%1)-1)*0.4
        x+=sq*g
    x*=adsr(n,0.015,min(0.08,L/3))
    x=np.tanh(x*1.4); x=bp(x,250,5200)
    return reverb(np.concatenate([x,np.zeros(int(0.4*SR))]),rt,wet)

def buzzer():
    L=0.75; n=int(L*SR)
    x=osc(220,L,'saw')+0.7*osc(222.5,L,'saw')+0.5*osc(440,L,'sq')
    x*=(0.85+0.15*np.sign(np.sin(2*np.pi*95*np.arange(n)/SR)))
    x=np.tanh(x*1.2)*adsr(n,0.01,0.05); x=bp(x,150,4500)
    return reverb(np.concatenate([x,np.zeros(int(0.3*SR))]),0.8,0.12)

def foghorn(L,far=False):
    n=int(L*SR); t=np.arange(n)/SR
    x=np.zeros(n)
    for f,g in [(82,1),(98,.9),(164,.5),(196,.45),(246,.2)]:
        slide=1+0.04*np.exp(-t/0.35)
        x+=g*osc(f*slide,L,'saw')
    x=lp(x,1400 if not far else 700,3)
    x*=adsr(n,0.35,1.2)*(1+0.05*np.sin(2*np.pi*0.9*t))
    x=np.tanh(x*0.8)
    x=np.concatenate([x,np.zeros(int(2.5*SR))])
    return reverb(x,3.2,0.55 if not far else 0.8)

def vuvuzela(L=2.0):
    n=int(L*SR); t=np.arange(n)/SR
    f=233*(1+0.006*np.sin(2*np.pi*6*t))
    x=osc(f,L,'sq')+0.6*osc(f*2.003,L,'saw')+0.4*osc(f*3,L,'sq')
    x=bp(x,180,3200); x*=adsr(n,0.08,0.15)*(0.9+0.1*np.sin(2*np.pi*12*t)); x=np.tanh(x*1.5)
    return reverb(np.concatenate([x,np.zeros(int(0.5*SR))]),1.2,0.25)

def train(L=10.0):
    n=int(L*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for f,g in [(311,1),(370,1),(466,.9),(233,.8),(622,.4)]:
        ff=f*(1+0.0015*np.sin(2*np.pi*3*t))
        x+=g*(0.6*osc(ff,L,'saw')+0.4*osc(ff,L,'sq'))
    x=lp(x,3200,2); x*=adsr(n,0.12,0.25)*(0.92+0.08*np.sin(2*np.pi*0.7*t)); x=np.tanh(x*0.9)
    out=reverb(x,1.8,0.22)
    return out

def brass_note(f,L,amp=1.0):
    n=int(L*SR); t=np.arange(n)/SR
    x=osc(f,L,'saw',0.0,0.006)+0.6*osc(f*1.003,L,'saw')+0.3*osc(f*2,L,'sq')
    fc=np.minimum(4000,600+ 5000*np.clip(t/0.12,0,1))
    # slow filter sweep via blocks
    out=np.zeros(n); B=512
    for i in range(0,n,B):
        c=float(fc[min(i,n-1)]); sos=signal.butter(2,min(c,SR/2-200),btype='low',fs=SR,output='sos')
        out[i:i+B]=signal.sosfilt(sos,x[i:i+B])  # block filter (state reset ok for sustained notes)
    return out*adsr(n,0.03,min(0.15,L*0.4))*amp

def melody(notes,tempo=84,amp=1.0,chord=False):
    beat=60/tempo; total=sum(d for _,d in notes)*beat+1.2
    out=np.zeros(int(total*SR)); pos=0.0
    for f,d in notes:
        L=d*beat
        if f>0:
            seg=brass_note(f,L*1.05+0.05,amp)
            if chord:
                for ratio in (1.25,1.5): seg=seg[:len(seg)]+brass_note(f*ratio,L*1.05+0.05,amp*0.6)[:len(seg)]
            i=int(pos*SR); out[i:i+len(seg)]+=seg[:len(out)-i]
        pos+=L
    return out

def fanfare():
    N=lambda m:440*2**((m-69)/12)
    seq=[(N(60),.5),(N(64),.5),(N(67),.5),(N(72),1.0),(N(67),.5),(N(72),2.5)]
    x=melody(seq,150,0.9,chord=True)
    cym=C.bed(len(x)/SR,[(0,0),(0.3,0),(0.31,1),(1,0)],np.random.default_rng(3),3000,9000,0.4)
    x=x[:len(cym)]+cym[:len(x)]
    # timpani/thump at start
    n=len(x); t=np.arange(n)/SR; x+=0.6*np.sin(2*np.pi*70*t)*np.exp(-t*8)
    return reverb(x,2.0,0.3)

def anthem():
    N=lambda m:440*2**((m-69)/12)
    # original stately theme in C major, ~12 s at 66 bpm
    q=[(N(67),1),(N(72),1.5),(N(71),.5),(N(69),1),(N(67),1),
       (N(64),1),(N(67),1.5),(N(65),.5),(N(64),1),(N(62),1),
       (N(60),1),(N(64),1),(N(67),1),(N(72),2),
       (N(74),1),(N(72),1.5),(N(71),.5),(N(69),1),(N(71),1),
       (N(72),3)]
    mel=melody(q,110,1.0)
    bass=melody([(N(48),4),(N(43),4),(N(45),4),(N(43),4),(N(48),3)],110,0.7)
    n=max(len(mel),len(bass)); x=np.zeros(n); x[:len(mel)]+=mel; x[:len(bass)]+=bass
    pad=np.zeros(n)
    t=np.arange(n)/SR
    # timpani roll start and cymbal finish
    x+=0.5*np.sin(2*np.pi*65*t)*np.exp(-(t%2.0)*5)*(t<1.0)
    cym=C.bed(n/SR,[(0,0),(0.84,0),(0.85,1),(1,0)],np.random.default_rng(4),3000,9000,0.3)
    x+=cym[:n]
    return reverb(x,2.6,0.4)

def ding():
    L=0.9; n=int(L*SR); t=np.arange(n)/SR
    x=np.sin(2*np.pi*988*t)*np.exp(-t*6)+0.5*np.sin(2*np.pi*1480*t)*np.exp(-t*8)+0.25*np.sin(2*np.pi*2960*t)*np.exp(-t*14)
    return reverb(x,0.6,0.15)
def wifidrop():
    n=int(0.55*SR); t=np.arange(n)/SR
    x=np.sin(2*np.pi*(700*np.exp(-t*1.2))*t)*np.exp(-t*3)
    y=np.sin(2*np.pi*(520*np.exp(-t*1.0))*t)*np.exp(-t*3)
    z=np.zeros(int(0.9*SR)); z[:n]+=x; z[int(0.18*SR):int(0.18*SR)+n]+=y[:len(z)-int(0.18*SR)][:n]
    return z
def pop():
    rng=np.random.default_rng(5); n=int(0.6*SR); t=np.arange(n)/SR
    x=rng.standard_normal(n)*np.exp(-t*30); x=bp(x,800,6000)+0.8*np.sin(2*np.pi*120*t)*np.exp(-t*25)
    return reverb(x,0.5,0.15)

def distinct_claps(dur,dens_pts,seed,level=1.0,body=True):
    rng=np.random.default_rng(seed); n=int(dur*SR); out=np.zeros(n)
    dens=interp(dens_pts,n); t=0.0
    while t<dur:
        d=dens[min(n-1,int(t*SR))]
        if d<=0.2: t+=0.03; continue
        t+=rng.exponential(1.0/d)
        if t>=dur-0.05: break
        L=int((0.012+rng.random()*0.018)*SR); i=int(t*SR)
        if i+L>=n: break
        tt=np.arange(L)/SR
        crack=rng.standard_normal(L)*np.exp(-tt*rng.uniform(260,420))
        c=rng.uniform(1100,2600); crack=bp(crack,c*0.7,min(SR/2-100,c*1.6))
        thock=np.sin(2*np.pi*rng.uniform(220,420)*tt)*np.exp(-tt*140)*0.4 if body else 0
        out[i:i+L]+=(crack+thock)*rng.uniform(0.45,1.0)
    return out*level
def whistles(dur,times,rng,level=0.2):
    n=int(dur*SR); t=np.arange(n)/SR; out=np.zeros(n)
    for t0 in times:
        L=rng.uniform(0.6,1.5); m=(t>=t0)&(t<t0+L); tt=t[m]-t0
        f=rng.uniform(2200,3300)*(1+0.12*np.sin(2*np.pi*rng.uniform(5,9)*tt))*(1+0.08*np.clip(tt/L,0,1))
        out[m]+=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/L)**0.4*level
    return out
def ovation(seed,dur,N,peak):
    rng=np.random.default_rng(seed)
    env=[(0,0),(0.1,0.5),(peak,1.0),(0.85,0.55),(1,0)]
    male=C.voices(dur,N,env,['ah','oh','eh'],100,170,lambda u:1+0.1*np.sin(np.pi*u),rng,0.18)
    fem=C.voices(dur,int(N*0.6),env,['ah','ee'],200,320,lambda u:1+0.12*np.sin(np.pi*u),rng,0.18)
    cheer=(male+fem)
    cheer=cheer/(np.abs(cheer).max()+1e-9)*0.45
    cl=soft(AP.applause_real(seed+100,dur,110,4.5,sharp_gain=11.0))*0.9
    wh=C.whoops(dur,[dur*peak*rng.uniform(0.7,1.1)+rng.uniform(0,0.5) for _ in range(6)],rng,1.0); wh=wh/(np.abs(wh).max()+1e-9)*0.45
    ws=whistles(dur,[dur*rng.uniform(0.12,0.8) for _ in range(5)],rng,0.3)
    x=cheer+cl+wh+ws
    return reverb(x,1.1,0.18,rng)
def soft(x,drive=1.9):
    x=x/(np.abs(x).max()+1e-9); return np.tanh(x*drive)/np.tanh(drive)
def applause_distinct(seed,dur,big):
    """A dense wash of many hands, with sharp individual claps standing out the whole way through."""
    M=130 if big and dur>8 else (100 if big else 70)
    return soft(AP.applause_real(seed,dur,M,4.5 if big else 4.0,sharp_gain=13.0))

if __name__=='__main__':
    save('horn-small',airhorn_clip(0.3,0.12,0.6,1.08))
    save('horn-stadium',airhorn_clip(2.2,0.5,2.6,1.0,0.03))
    save('buzzer',buzzer())
    save('fog-1',foghorn(3.8))
    save('fog-far',foghorn(3.6,True)*0.35)
    save('vuvuzela',vuvuzela())
    save('train',train(10.0))
    save('fanfare',fanfare())
    save('anthem',anthem())
    save('ding',ding()); save('wifi-drop',wifidrop()); save('pop',pop())
    for i,(d,N,p) in enumerate([(5.0,40,0.4),(6.5,48,0.45),(8.0,56,0.5)]): save(f'ovation-{i+1}',ovation(200+i,d,N,p))
    save('applause-1',applause_distinct(210,4.5,False)); save('applause-2',applause_distinct(211,7.0,True)); save('applause-3',applause_distinct(212,9.0,True))
