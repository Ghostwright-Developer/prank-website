import Script from "next/script"

/**
 * Goes fullscreen on the very first click, tap or key press on a prank screen,
 * even if that happens before React has hydrated (slow phones, cold caches).
 * Browsers only allow fullscreen from a user gesture, so this is the earliest
 * moment it can possibly happen for someone opening a link cold. Runs only on
 * /screens/* and removes itself after the first successful attempt.
 */
const code = `(function(){
  try{
    if(location.pathname.indexOf('/screens/')!==0)return;
    var ev=['pointerdown','mousedown','click','touchend','keydown'];
    function off(){ev.forEach(function(t){document.removeEventListener(t,go,true)})}
    function go(e){
      if(e&&e.type==='keydown'){
        var k=e.key; if(k==='Escape'||k==='q'||k==='Q'||e.ctrlKey||e.metaKey||e.altKey)return;
      }
      if(document.fullscreenElement||document.webkitFullscreenElement){off();return}
      var el=document.documentElement;
      var f=el.requestFullscreen||el.webkitRequestFullscreen;
      if(!f)return;
      try{var r=f.call(el);if(r&&r.then){r.then(off,function(){})}else{off()}}catch(_){}
    }
    ev.forEach(function(t){document.addEventListener(t,go,true)});
  }catch(_){}
})();`

export function EarlyFullscreen() {
  return <Script id="early-fullscreen" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: code }} />
}
