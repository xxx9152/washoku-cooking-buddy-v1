// TextPressure interaction adapted to the existing typeface and unchanged colours.
(()=>{
  const title=document.querySelector('.landing-copy h1');if(!title)return;
  title.classList.add('pressure-title');title.setAttribute('aria-label','Open your kitchen story.');
  title.replaceChildren();
  const letters=[];
  ['Open your','kitchen story.'].forEach((text,row)=>{
    const line=document.createElement('span');line.className='pressure-line'+(row?' pressure-orange':'');line.setAttribute('aria-hidden','true');
    Array.from(text).forEach(char=>{const span=document.createElement('span');span.className='pressure-letter';span.textContent=char;line.append(span);letters.push({span,value:0});});title.append(line);
  });
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let pointer=null,ripples=[],raf=0,last=0,visible=false;
  const wake=()=>{if(!raf&&visible&&!motion.matches)raf=requestAnimationFrame(frame);};
  title.addEventListener('pointermove',e=>{pointer={x:e.clientX,y:e.clientY};wake();});
  title.addEventListener('pointerleave',()=>{pointer=null;wake();});
  title.addEventListener('pointerdown',e=>{ripples.push({x:e.clientX,y:e.clientY,start:performance.now()});ripples=ripples.slice(-6);wake();});
  function frame(now){
    raf=0;if(!visible||motion.matches)return;
    const dt=last?Math.min(now-last,64):16;last=now;
    const box=title.getBoundingClientRect(),reach=Math.max(box.width*.45,1),follow=1-Math.exp(-dt/125);
    ripples=ripples.filter(r=>now-r.start<1300);
    const centers=letters.map(({span})=>{const b=span.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
    letters.forEach((letter,index)=>{
      const p=centers[index];
      let pressure=pointer?Math.max(0,1-Math.hypot(p.x-pointer.x,p.y-pointer.y)/reach):.12*Math.pow(.5+.5*Math.cos(index*.45-now/1500),2);
      for(const r of ripples){const age=(now-r.start)/1000,offset=(Math.hypot(p.x-r.x,p.y-r.y)-age*box.width*1.25)/Math.max(box.width*.14,32);if(Math.abs(offset)<1){const swell=Math.pow(1-offset*offset,2)*Math.pow(1-age/1.3,2);pressure=1-(1-pressure)*(1-swell);}}
      letter.value+=(pressure-letter.value)*follow;
      const v=letter.value;
      letter.span.style.transform=`translateY(${-2*v}px) scale(${1+.12*v},${1+.15*v}) skewX(${-5*v}deg)`;
      letter.span.style.fontVariationSettings=`'wght' ${800+100*v}, 'wdth' ${100+15*v}`;
    });wake();
  }
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;wake();}).observe(title);
  motion.addEventListener('change',()=>{if(motion.matches)letters.forEach(({span})=>{span.style.transform='';span.style.fontVariationSettings='';});else wake();});
})();
