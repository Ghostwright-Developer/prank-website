"""Realistic applause: a dense wash of many different hands, plus sharp individual claps that stay audible throughout."""
import sys; sys.path.insert(0,'/tmp/work')
import numpy as np, subprocess
from scipy import signal
from crowd import SR, reverb, interp

def bp(x,lo,hi,order=2):
    return signal.sosfilt(signal.butter(order,[lo,min(hi,SR/2-200)],btype='band',fs=SR,output='sos'),x)
def lp(x,fc): return signal.sosfilt(signal.butter(2,fc,btype='low',fs=SR,output='sos'),x)
def hp(x,fc): return signal.sosfilt(signal.butter(2,fc,btype='high',fs=SR,output='sos'),x)

def template(rng,near):
    """One hand clap: a flam (hands never land together), a hollow cavity resonance, a short body thock."""
    L=int(0.11*SR); t=np.arange(L)/SR
    f1=rng.uniform(1300,2500) if near else rng.uniform(850,1900)
    tau=rng.uniform(0.005,0.011) if near else rng.uniform(0.008,0.02)
    def burst(f,tau_):
        n=rng.standard_normal(L)
        x=bp(n,f*0.72,f*1.45)*np.exp(-t/tau_)
        x+=0.55*bp(rng.standard_normal(L),f*1.9,f*3.2)*np.exp(-t/(tau_*0.6))
        return x
    x=burst(f1,tau)
    d=int(rng.uniform(0.002,0.008)*SR)          # flam
    x[d:]+=0.55*burst(f1*rng.uniform(.85,1.2),tau*0.8)[:L-d]
    thock=np.sin(2*np.pi*rng.uniform(170,330)*t)*np.exp(-t/rng.uniform(0.012,0.024))
    x+=thock*(0.55 if near else 0.25)*np.abs(x).max()
    a=int(0.0006*SR); x[:a]*=np.linspace(0,1,a)
    return x/(np.abs(x).max()+1e-9)

def make_env(dur,rng,attack=0.4,release=1.8):
    n=int(dur*SR); t=np.arange(n)/SR
    e=np.minimum(1,t/attack)**1.5
    e*=np.where(t>dur-release,np.exp(-(t-(dur-release))*2.2/release),1.0)
    wander=interp([(i/8,1+0.14*rng.standard_normal()) for i in range(9)],n)
    return np.clip(e*wander,0,1.2)

def wash(dur,rng,env,M,tmpl):
    n=int(dur*SR); out=np.zeros(n)
    # crowds drift into loose sync: a gentle 2-3 Hz swell in how many people clap at once
    f0=rng.uniform(2.3,3.0); ph=rng.uniform(0,6.28)
    for _ in range(M):
        period=rng.uniform(0.26,0.42); t=rng.uniform(0,period)
        while t<dur-0.1:
            i=int(t*SR); p=env[min(n-1,i)]*(1+0.22*np.sin(2*np.pi*f0*t+ph))
            if rng.random()<min(1,p):
                tp=tmpl[rng.integers(len(tmpl))]
                a=np.exp(rng.normal(0,0.55)); a=min(a,2.4)
                m=min(len(tp),n-i); out[i:i+m]+=tp[:m]*a*0.55
            t+=period*(1+rng.normal(0,0.13))
    return out

def sharp(dur,rng,env,rate,tmpl):
    """Individual claps close to the microphone: loose groups of 1-4 that keep turning up the whole way through."""
    n=int(dur*SR); out=np.zeros(n); t=rng.uniform(0.15,0.45)
    while t<dur-0.2:
        i=int(t*SR)
        if rng.random()<min(1,env[min(n-1,i)]*1.05):
            k=rng.choice([1,2,2,3,4]); gap=rng.uniform(0.15,0.30); tt=t
            for j in range(k):
                ii=int(tt*SR)
                if ii>=n-4000: break
                tp=tmpl[rng.integers(len(tmpl))]
                a=rng.uniform(0.75,1.0)*(0.8+0.2*(j==0))
                m=min(len(tp),n-ii); out[ii:ii+m]+=tp[:m]*a
                tt+=gap*(1+rng.normal(0,0.1))
        t+=rng.exponential(1.0/rate)+0.12
    return out

def applause_real(seed,dur,M,rate,sharp_gain=3.2,wet=0.42,rt=1.7,env_over=None):
    rng=np.random.default_rng(seed)
    far=[template(rng,False) for _ in range(70)]; near=[template(rng,True) for _ in range(34)]
    env=make_env(dur,rng) if env_over is None else env_over
    w=wash(dur,rng,env,M,far); w=hp(lp(w,8200),140)
    w=reverb(w,rt,wet,rng)
    w=w/(np.sqrt(np.mean(w**2))+1e-9)*0.12            # wash sits at a steady, even level ...
    s=sharp(dur,rng,env,rate,near); s=hp(lp(s,9500),160)
    s=reverb(s,0.5,0.10,rng)
    s=s/(np.abs(s).max()+1e-9)*0.12*sharp_gain          # ... and the sharp claps stand well above it
    return w+s

def save_hq(name,x,out,peak=0.88):
    x=x/(np.abs(x).max()+1e-9)*peak
    f=int(0.04*SR); x[:f]*=np.linspace(0,1,f); x[-f*3:]*=np.linspace(1,0,f*3)
    pcm=(x*32767).astype(np.int16); raw='/tmp/work/_a.raw'; pcm.tofile(raw)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-f','s16le','-ar',str(SR),'-ac','1','-i',raw,'-b:a','112k','-ac','1',f'{out}/{name}.mp3'],check=True)
