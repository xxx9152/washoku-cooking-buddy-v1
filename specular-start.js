// SpecularButton visual behavior adapted to this buildless site without another GPU context.
(()=>{
 const selector='.fridge-food-action,.dish-start button';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let eventPending=false,point=null;
 function paint(){eventPending=false;if(!point)return;document.querySelectorAll(selector).forEach(button=>{
  if(button.hidden||!button.getClientRects().length)return;
  const r=button.getBoundingClientRect(),x=point.x-r.left-r.width/2,y=point.y-r.top-r.height/2;
  const distance=Math.hypot(Math.max(Math.abs(x)-r.width/2,0),Math.max(Math.abs(y)-r.height/2,0));
  const near=Math.max(0,1-distance/250),level=.35+.65*near*near*(3-2*near);
  button.style.setProperty('--sb-level',level.toFixed(3));
  if(!reduce){button.style.setProperty('--sb-angle',(Math.atan2(y,x)*180/Math.PI+68)+'deg');button.style.setProperty('--sb-x',Math.max(0,Math.min(100,(x/r.width+.5)*100))+'%');button.style.setProperty('--sb-y',Math.max(0,Math.min(100,(y/r.height+.5)*100))+'%');}
 });}
 document.addEventListener('pointermove',e=>{point={x:e.clientX,y:e.clientY};if(!eventPending){eventPending=true;requestAnimationFrame(paint);}},{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>{point=null;document.querySelectorAll(selector).forEach(b=>b.style.setProperty('--sb-level','.35'));});
})();
