import numpy as np, subprocess, sys, os
from scipy import signal
SR=32000
OUT='/tmp/pv/public/sfx'; os.makedirs(OUT,exist_ok=True)
FORM={'ah':(730,1090,2440),'oh':(570,840,2410),'oo':(300,870,2240),'ee':(270,2290,3010),'aw':(600,900,2500),'eh':(530,1840,2480)}
def formant(x,v,bw=(90,110,160),gains=(1,0.6,0.25)):
    out=np.zeros_like(x)
    for f,b,g in zip(FORM[v],bw,gains):
        sos=signal.butter(2,[max(40,f-b),min(SR/2-100,f+b)],btype='band',fs=SR,output='sos')
        out+=g*signal.sosfilt(sos,x)
    return out
def reverb(x,rt=1.4,wet=0.35,rng=None):
    rng=rng or np.random.default_rng(1)
    n=int(rt*SR); t=np.arange(n)/SR
    ir=rng.standard_normal(n)*np.exp(-t*6.0/rt)
    sos=signal.butter(2,5000,btype='low',fs=SR,output='sos'); ir=signal.sosfilt(sos,ir)
    ir[:int(0.02*SR)]*=np.linspace(0,1,int(0.02*SR))
    w=signal.fftconvolve(x,ir)[:len(x)]
    w/= (np.abs(w).max()+1e-9)/(np.abs(x).max()+1e-9)
    return x*(1-wet)+w*wet
def norm(x,peak=0.85):
    return x/(np.abs(x).max()+1e-9)*peak
def interp(env_pts,n):
    xs=np.array([p[0] for p in env_pts])*n; ys=np.array([p[1] for p in env_pts])
    return np.interp(np.arange(n),xs,ys)
def voices(dur,N,envpts,vowels,f0lo,f0hi,contour,rng,breath=0.12,jitter=1.0,spread=0.25):
    """Sum of N formant-ish voices grouped by vowel; contour(t_norm)->pitch multiplier."""
    n=int(dur*SR); t=np.arange(n)/SR; tn=t/dur
    genv=interp(envpts,n)
    groups={v:np.zeros(n) for v in vowels}
    for i in range(N):
        v=vowels[rng.integers(len(vowels))] if not isinstance(vowels,dict) else None
        on=rng.random()*dur*spread; off=dur-rng.random()*dur*spread*0.6
        loc=np.clip((t-on)/0.12,0,1)*np.clip((off+0.25-t)/0.25,0,1)
        wob=1+0.3*jitter*np.sin(2*np.pi*(0.4+rng.random()*1.5)*t+rng.random()*6)
        f0=(f0lo+(f0hi-f0lo)*rng.random())*contour(np.clip(tn+rng.normal(0,0.04),0,1))
        vib=1+0.012*np.sin(2*np.pi*(4.5+rng.random()*2)*t+rng.random()*6)
        ph=np.cumsum(f0*vib/SR)
        src=2*(ph%1)-1
        src=src*(1-breath)+breath*rng.standard_normal(n)
        amp=0.5+rng.random()
        groups[v]+=src*loc*genv*wob*amp
    out=np.zeros(n)
    for v,x in groups.items():
        if np.abs(x).max()>0: out+=formant(x,v)
    return out
def claps(dur,density_pts,rng,lo=900,hi=4500,level=0.5):
    n=int(dur*SR); out=np.zeros(n)
    dens=interp(density_pts,n)
    k=int(dens.sum()/SR*1.0)
    cnt=0
    # density = claps per second
    t=0.0
    while t<dur:
        d=dens[min(n-1,int(t*SR))]
        if d<=0.01: t+=0.02; continue
        t+=rng.exponential(1.0/d)
        if t>=dur: break
        L=int((0.006+rng.random()*0.012)*SR); i=int(t*SR)
        if i+L>=n: break
        burst=rng.standard_normal(L)*np.exp(-np.arange(L)/(L*0.25))
        c=rng.uniform(lo,hi); sos=signal.butter(2,[c*0.6,min(SR/2-100,c*1.5)],btype='band',fs=SR,output='sos')
        out[i:i+L]+=signal.sosfilt(sos,burst)*rng.uniform(0.3,1.0)
    return out*level
def bed(dur,env_pts,rng,lo=300,hi=3000,level=0.2):
    n=int(dur*SR); x=rng.standard_normal(n)
    sos=signal.butter(2,[lo,hi],btype='band',fs=SR,output='sos')
    return signal.sosfilt(sos,x)*interp(env_pts,n)*level
def whoops(dur,times,rng,level=0.35):
    n=int(dur*SR); t=np.arange(n)/SR; out=np.zeros(n)
    for t0 in times:
        L=0.5+rng.random()*0.5; f0=rng.uniform(350,520)
        m=(t>=t0)&(t<t0+L); tt=(t[m]-t0)/L
        f=f0*(1+0.9*np.sin(np.pi*np.minimum(tt,1)*0.9))
        ph=np.cumsum(f/SR); s=2*(ph%1)-1
        s=formant(np.pad(s,(0,0)),'ah') if False else s
        out[m]+=s*np.sin(np.pi*tt)**0.7
    return formant(out,'ah')*level
def whistle(dur,t0,L,rng,level=0.12):
    n=int(dur*SR); t=np.arange(n)/SR; out=np.zeros(n)
    m=(t>=t0)&(t<t0+L); tt=t[m]-t0
    f=rng.uniform(2300,3200)+300*np.sin(2*np.pi*7*tt)
    out[m]=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/L)**0.5*level
    return out
def save(name,x,rev=None):
    x=norm(x)
    # fades
    f=int(0.03*SR); x[:f]*=np.linspace(0,1,f); x[-f*3:]*=np.linspace(1,0,f*3)
    pcm=(x*32767).astype(np.int16)
    raw='/tmp/work/_c.raw'; pcm.tofile(raw)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-f','s16le','-ar',str(SR),'-ac','1','-i',raw,'-b:a','72k','-ac','1',f'{OUT}/{name}.mp3'],check=True)
    print(name,round(len(x)/SR,1),'s',flush=True)

def cheer(seed,dur,N,peak,kind='cheer'):
    rng=np.random.default_rng(seed)
    env=[(0,0),(0.12,0.5),(peak,1.0),(0.85,0.6),(1,0)]
    male=voices(dur,N,env,['ah','oh','ah','ee','eh'],95,170,lambda u:1+0.12*np.sin(np.pi*u),rng,breath=0.15)
    fem=voices(dur,int(N*0.6),env,['ah','ee','oh'],190,320,lambda u:1+0.15*np.sin(np.pi*u),rng,breath=0.15)
    x=male+fem*0.9
    x+=bed(dur,env,rng,350,3500,0.25*np.abs(x).max()) 
    x+=claps(dur,[(0,0),(0.15,25),(peak,90),(1,10)],rng,level=0.35*np.abs(x).max())
    x+=whoops(dur,[dur*peak*rng.uniform(0.6,1.1)+rng.uniform(0,0.4) for _ in range(max(2,N//12))],rng,0.4*np.abs(x).max())
    x+=whistle(dur,dur*peak*0.8,0.9,rng,0.1*np.abs(x).max())
    return reverb(x,1.6,0.35,rng)
def roar(seed,dur,N):
    rng=np.random.default_rng(seed)
    env=[(0,0.02),(0.35,0.35),(0.42,1.0),(0.7,0.85),(1,0)]
    male=voices(dur,N,env,['ah','oh','ah','aw'],90,160,lambda u:0.92+0.3*np.clip(u/0.45,0,1)-0.2*np.clip((u-0.6)/0.4,0,1),rng,0.2,spread=0.5)
    fem=voices(dur,int(N*0.7),env,['ah','ee','oh'],190,330,lambda u:0.95+0.25*np.clip(u/0.45,0,1)-0.15*np.clip((u-0.6)/0.4,0,1),rng,0.2,spread=0.5)
    x=male+fem
    x+=bed(dur,env,rng,300,4000,0.35*np.abs(x).max())
    x+=claps(dur,[(0,0),(0.35,30),(0.45,140),(0.85,60),(1,5)],rng,level=0.4*np.abs(x).max())
    x+=whoops(dur,[dur*0.4+rng.uniform(0,dur*0.35) for _ in range(N//8)],rng,0.45*np.abs(x).max())
    for _ in range(3): x+=whistle(dur,dur*rng.uniform(0.38,0.7),rng.uniform(0.6,1.2),rng,0.1*np.abs(x).max())
    return reverb(x,2.0,0.4,rng)
def boo(seed,dur,N):
    rng=np.random.default_rng(seed)
    env=[(0,0),(0.18,0.8),(0.5,1.0),(0.85,0.7),(1,0)]
    male=voices(dur,N,env,['oo','oh','oo','oo'],80,140,lambda u:1.1-0.28*u,rng,0.1,jitter=1.6,spread=0.2)
    fem=voices(dur,int(N*0.4),env,['oo','oh'],160,240,lambda u:1.08-0.25*u,rng,0.1,jitter=1.6,spread=0.2)
    x=male+fem*0.7
    x+=bed(dur,env,rng,150,900,0.15*np.abs(x).max())
    return reverb(x,1.5,0.3,rng)
def groan(seed,dur,N,vow=('aw','oh'),hi=1.0):
    rng=np.random.default_rng(seed)
    env=[(0,0),(0.12,0.9),(0.45,1.0),(1,0)]
    male=voices(dur,N,env,list(vow),120*hi,210*hi,lambda u:1.25-0.65*u,rng,0.1,spread=0.2)
    fem=voices(dur,int(N*0.6),env,list(vow),210*hi,330*hi,lambda u:1.2-0.6*u,rng,0.1,spread=0.2)
    x=male+fem*0.8
    x+=bed(dur,env,rng,300,1800,0.1*np.abs(x).max())
    return reverb(x,1.4,0.3,rng)
def ooh_rise(seed,dur,N):
    rng=np.random.default_rng(seed)
    env=[(0,0),(0.5,0.8),(0.9,1.0),(1,0)]
    male=voices(dur,N,env,['oo','oh','oh'],110,190,lambda u:0.85+0.55*u,rng,0.1,spread=0.2)
    fem=voices(dur,int(N*0.7),env,['oo','oh','ee'],200,320,lambda u:0.85+0.6*u,rng,0.1,spread=0.2)
    return reverb(male+fem,1.4,0.3,rng)
def gasp(seed,dur=1.3,N=60):
    rng=np.random.default_rng(seed); n=int(dur*SR)
    env=[(0,0),(0.55,1.0),(0.7,0.15),(1,0)]
    x=np.zeros(n)
    for _ in range(N):
        on=rng.random()*0.2*dur; L=int(n*rng.uniform(0.35,0.5)); s=int(on*SR)
        w=rng.standard_normal(L)
        sos=signal.butter(2,[rng.uniform(900,1500),rng.uniform(3500,5500)],btype='band',fs=SR,output='sos')
        e=np.sin(np.linspace(0,np.pi,L))**1.6
        x[s:s+L]+=signal.sosfilt(sos,w)[:n-s]*e[:n-s]*rng.uniform(0.4,1)
    x*=interp(env,n)+0.2
    fem=voices(dur,12,[(0,0),(0.6,1),(1,0)],['ah','ee'],200,330,lambda u:0.9+0.5*u,rng,0.3)
    return reverb(x+0.15*fem,1.2,0.3,rng)
def applause(seed,dur,big):
    rng=np.random.default_rng(seed)
    d=140 if big else 60
    pts=[(0,0),(0.1,d*0.5),(0.3,d),(0.75,d*0.8),(1,0)]
    x=claps(dur,pts,rng,700,5000,1.0)
    x+=bed(dur,[(0,0),(0.15,0.6),(0.3,1),(0.8,0.7),(1,0)],rng,1500,7000,0.12*np.abs(x).max()*3)
    return reverb(x,1.8,0.45,rng)
def murmur(seed,dur=6):
    rng=np.random.default_rng(seed); n=int(dur*SR); t=np.arange(n)/SR
    env=[(0,0.3),(0.5,1),(1,0.3)]
    out=np.zeros(n)
    for v in ['ah','eh','oh','ee','oo']:
        x=np.zeros(n)
        for _ in range(14):
            f0=rng.uniform(90,300); ph=np.cumsum(f0*(1+0.03*np.sin(2*np.pi*rng.uniform(1,3)*t))/SR)
            syl=np.clip(np.sin(2*np.pi*rng.uniform(3,5)*t+rng.random()*6),0,1)**1.3
            x+=(2*(ph%1)-1)*syl*rng.uniform(0.3,1)
        out+=formant(x,v)
    out*=interp(env,n)
    out+=bed(dur,env,rng,200,2500,0.12*np.abs(out).max())
    return reverb(out,1.6,0.45,rng)
def airhorn(blasts,L):
    n=int((blasts*(L+0.12)+0.5)*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for b in range(blasts):
        s=int(b*(L+0.12)*SR); m=int(L*SR)
        tt=np.arange(m)/SR
        env=np.clip(tt/0.02,0,1)*np.clip((L-tt)/0.06,0,1)
        for f,g in [(415,1),(494,0.9),(622,0.9),(207,0.7),(830,0.4)]:
            fm=f*(1+0.004*np.sin(2*np.pi*31*tt))*(1-0.02*(tt/L)**3)
            ph=np.cumsum(fm/SR); sq=np.sign(np.sin(2*np.pi*ph))*0.6+ (2*(ph%1)-1)*0.4
            x[s:s+m]+=sq*g*env
    x=np.tanh(x*1.4)
    sos=signal.butter(2,[250,5200],btype='band',fs=SR,output='sos'); x=signal.sosfilt(sos,x)
    return reverb(x,1.2,0.25)

if __name__=='__main__':
    for i,(d,N,p) in enumerate([(3.0,70,0.4),(4.5,90,0.45),(2.0,60,0.35)]): save(f'cheer-{i+1}',cheer(10+i,d,N,p))
    for i,(d,N,p) in enumerate([(7.5,130,0.45),(9.0,150,0.5)]): save(f'cheer-big-{i+1}',cheer(20+i,d,N,p))
    for i,(d,N) in enumerate([(9.5,160),(8.0,140),(11.0,180)]): save(f'roar-{i+1}',roar(30+i,d,N))
    for i,(d,N) in enumerate([(2.6,60),(4.0,80),(6.0,110)]): save(f'boo-{i+1}',boo(40+i,d,N))
    for i,(d,N,v,h) in enumerate([(2.2,60,('aw','oh'),1.0),(3.6,80,('aw','ah'),0.9),(2.8,70,('oh','oo'),1.1),(5.0,90,('aw','oh'),1.0)]): save(f'groan-{i+1}',groan(50+i,d,N,v,h))
    for i,(d,N) in enumerate([(2.0,60),(3.2,90)]): save(f'ooh-{i+1}',ooh_rise(60+i,d,N))
    for i in range(2): save(f'gasp-{i+1}',gasp(70+i))
    save('applause-1',applause(80,4.0,False)); save('applause-2',applause(81,6.5,True)); save('applause-3',applause(82,9.0,True))
    for i in range(2): save(f'murmur-{i+1}',murmur(90+i))
    save('airhorn-1',airhorn(1,0.9)); save('airhorn-3',airhorn(3,0.4)); save('airhorn-2',airhorn(2,0.55))
