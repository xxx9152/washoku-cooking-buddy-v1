(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function init(){
 const sheet=document.querySelector('link[href^="shop-motion.css"]');if(sheet)document.head.append(sheet);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width','0');svg.setAttribute('height','0');svg.setAttribute('aria-hidden','true');svg.style.position='absolute';svg.innerHTML='<defs><filter id="recipe-liquid-filter" x="-30%" y="-120%" width="160%" height="340%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs>';document.body.append(svg);
 document.querySelectorAll('.tabs').forEach(nav=>{
 const buttons=[...nav.querySelectorAll('button[data-t]')];if(!buttons.length)return;
 nav.classList.add('recipe-gooey');const layer=document.createElement('span');layer.className='recipe-goo-layer';layer.setAttribute('aria-hidden','true');const pill=document.createElement('span');pill.className='recipe-goo-pill';layer.append(pill);nav.prepend(layer);
 let last=null,active=buttons.find(b=>b.classList.contains('on'))||buttons[0],animations=[],flight=0,inFlight=false;
 const box=b=>({x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight});
 function position(b,animate=false){const target=box(b);if(!target.w)return;
  if(!animate&&inFlight)return;
  if(animate&&last&&!reduced){cancelAnimationFrame(flight);inFlight=true;const from={...last},began=performance.now();pill.style.transition='none';
   const move=now=>{const t=Math.min(1,(now-began)/850),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;const bounce=Math.sin(t*Math.PI*3)*Math.sin(t*Math.PI)*.09;const x=from.x+(target.x-from.x)*ease,y=from.y+(target.y-from.y)*ease,w=(from.w+(target.w-from.w)*ease)*(1+bounce),h=target.h*(1-bounce);pill.style.width=w+'px';pill.style.height=h+'px';pill.style.transform=`translate(${x+(target.w-w)/2}px,${y+(target.h-h)/2}px)`;last={x,y,w:target.w,h:target.h};if(t<1)flight=requestAnimationFrame(move);else{inFlight=false;last=target;}};flight=requestAnimationFrame(move);
   animations.forEach(a=>a.cancel());layer.querySelectorAll('.recipe-goo-drop').forEach(d=>d.remove());animations=[];
   for(let i=0;i<15;i++){const drop=document.createElement('i');drop.className='recipe-goo-drop';const size=8+Math.random()*10;drop.style.width=drop.style.height=size+'px';drop.style.left='0';drop.style.top='0';layer.append(drop);
    const sx=last.x+last.w/2-size/2,sy=last.y+last.h/2-size/2,ex=target.x+target.w/2-size/2,ey=target.y+target.h/2-size/2;
    const bend=(i%2?1:-1)*(22+Math.random()*24);
    const a=drop.animate([{transform:`translate(${sx}px,${sy}px) scale(.8)`,opacity:1},{transform:`translate(${sx+(ex-sx)*.35}px,${sy+bend}px) scale(1.8)`,offset:.35,opacity:1},{transform:`translate(${ex}px,${ey}px) scale(.25)`,opacity:0}],{duration:760+Math.random()*200,easing:'cubic-bezier(.22,.75,.2,1)',fill:'forwards'});a.onfinish=()=>drop.remove();animations.push(a);
   }
   pill.animate([{scale:'1 1'},{scale:'1.07 .90',offset:.45},{scale:'.98 1.04',offset:.8},{scale:'1 1'}],{duration:650,easing:'ease-out'});
  }
  if(!inFlight){pill.style.width=target.w+'px';pill.style.height=target.h+'px';pill.style.transform=`translate(${target.x}px,${target.y}px)`;last=target;}
 }
 nav.addEventListener('click',event=>{const button=event.target.closest('button[data-t]');if(!button||!buttons.includes(button)||button===active)return;active=button;position(button,true);},true);
 new MutationObserver(()=>{const next=buttons.find(b=>b.classList.contains('on'));if(next&&next!==active){active=next;position(next,true);}}).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
 new ResizeObserver(()=>position(active)).observe(nav);requestAnimationFrame(()=>position(active));
 });
 document.addEventListener('pointerdown',e=>{const b=e.target.closest('.modes button,.actions button');if(!b||reduced)return;const r=b.getBoundingClientRect(),wave=document.createElement('i');wave.className='shop-tap-wave';wave.style.left=e.clientX-r.left+'px';wave.style.top=e.clientY-r.top+'px';b.append(wave);setTimeout(()=>wave.remove(),650);});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
