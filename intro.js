/* Intro animasi naga + suara - Mediaas */
(function(){
  var el=document.getElementById("intro"),wipe=document.getElementById("introWipe");
  if(!el)return;
  var v=el.querySelector("video"),snd=document.getElementById("iSnd"),skip=document.getElementById("iSkip");
  var KEY="mediaas_intro_seen",done=false,leaving=false;
  function lock(on){document.body&&document.body.classList.toggle("intro-lock",on);document.documentElement.style.overflow=on?"hidden":"";}
  function remove(){done=true;lock(false);el.classList.add("hide");if(wipe)wipe.classList.remove("run");try{v.pause();v.removeAttribute("src");v.load();}catch(e){}
    setTimeout(function(){el.remove();wipe&&wipe.remove();},50);}
  try{
    if(sessionStorage.getItem(KEY)||matchMedia("(prefers-reduced-motion: reduce)").matches){el.remove();wipe&&wipe.remove();return;}
    sessionStorage.setItem(KEY,"1");
  }catch(e){}
  lock(true);
  function leave(fast){
    if(leaving||done)return;leaving=true;
    el.classList.add("go");
    if(wipe)wipe.classList.add("run");
    var cover=fast?500:720;
    setTimeout(function(){el.classList.add("hide");lock(false);},cover);
    setTimeout(remove,cover+700);
    try{var a=v.volume;var s=setInterval(function(){a=Math.max(0,a-.1);v.volume=a;if(a<=0)clearInterval(s);},60);}catch(e){}
  }
  function syncSnd(){var live=!v.muted;snd.classList.toggle("live",live);snd.classList.toggle("pulse",!live);snd.setAttribute("aria-pressed",live?"true":"false");}
  var unlocked=false;
  function unlock(){if(unlocked)return;unlocked=true;v.muted=false;v.volume=1;v.play().catch(function(){});syncSnd();}
  function start(){
    el.classList.add("on");
    v.muted=false;v.volume=1;
    var p=v.play();
    if(p&&p.catch)p.catch(function(){
      v.muted=true;
      v.play().catch(function(){leave(true);});
      syncSnd();
    });
    syncSnd();
  }
  snd.addEventListener("click",function(e){e.stopPropagation();v.muted=!v.muted;unlocked=!v.muted;if(!v.muted){v.volume=1;v.play().catch(function(){});}syncSnd();});
  skip.addEventListener("click",function(e){e.stopPropagation();leave(true);});
  el.addEventListener("pointerdown",unlock,{once:false});
  document.addEventListener("keydown",function(e){if(done)return;if(e.key==="Escape"||e.key==="Enter"||e.key===" ")leave(true);else unlock();});
  v.addEventListener("timeupdate",function(){if(v.currentTime>=4.95)leave();});
  v.addEventListener("ended",function(){leave();});
  v.addEventListener("error",function(){remove();});
  setTimeout(function(){if(!leaving&&v.currentTime<.1)remove();},6000); // video gagal dimuat -> langsung masuk web
  setTimeout(function(){if(!leaving)leave();},9000);                      // pengaman
  if(v.readyState>=3)start();else{v.addEventListener("canplay",start,{once:true});v.load();}
})();
