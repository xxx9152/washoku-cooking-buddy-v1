(() => {
  const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='recipe-polish.css?v=2';document.head.appendChild(sheet);
  // PulseHeart reference: shrink to 30%, swap at 40%, then spring back.
  window.pulseFavourite=(button,key)=>{
    if(button.dataset.running)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){toggleFav(key);return;}
    button.dataset.running='true';
    const glyph=button.querySelector('.favourite-glyph');
    const start=performance.now();let swapped=false;
    const tick=now=>{
      const t=Math.min(1,(now-start)/680);
      let swell;
      if(t<.4)swell=1-Math.pow(1-t/.4,3);
      else{const u=(t-.4)/.6-1;swell=-(2.7*u*u*u+1.7*u*u);}
      glyph.style.transform=`scale(${1-.7*swell})`;
      button.style.scale=String(1-.03*swell);
      if(!swapped&&t>=.4){swapped=true;toggleFav(key);}
      if(t<1)requestAnimationFrame(tick);
      else{glyph.style.transform='';button.style.scale='';delete button.dataset.running;}
    };
    requestAnimationFrame(tick);
  };
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')document.getElementById('visitor-modal')?.classList.remove('on');
  });
})();
