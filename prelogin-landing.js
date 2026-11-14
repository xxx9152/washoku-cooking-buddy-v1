(function(){
  const landingDishes=[
    {key:'omurice',name:'Omurice',emoji:'🍳',live:true},
    {key:'sushi',name:'Sushi',emoji:'🍣'},
    {key:'ramen',name:'Ramen',emoji:'🍜'},
    {key:'curry',name:'Japanese Curry',emoji:'🍛'},
    {key:'udon',name:'Udon',emoji:'🍝'}
  ];
  let pendingDish='';
  function dishData(key){const images={omurice:'assets/omurice-hero.png',ramen:'assets/landing-ramen.jpg',curry:'assets/landing-curry.jpg',udon:'assets/landing-udon.jpg'};return images[key]?{img:images[key]}:null;}
  function grid(){return document.getElementById('landing-dish-grid');}
  function renderLandingDishes(){
    const target=grid();if(!target)return;
    target.innerHTML=landingDishes.map(item=>{const d=dishData(item.key),image=d&&d.img?`<img src="${d.img}" alt="${item.name}">`:`<div class="landing-dish-emoji">${item.emoji}</div>`;return `<article class="landing-dish" data-key="${item.key}" tabindex="0" role="button" aria-label="${item.name}${item.live?'':' coming soon'}" onclick="selectLandingDish('${item.key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectLandingDish('${item.key}')}">${image}<div class="dish-tint"></div><b class="dish-name">${item.name}</b><span class="dish-status">${item.live?'LIVE':'COMING SOON'}</span><span class="dish-start"><button type="button" onclick="event.stopPropagation();startFromLanding('${item.key}',${item.live})">${item.live?'Get started →':'Notify me'}</button></span></article>`;}).join('');
  }
  window.selectLandingDish=function(key){const card=grid()?.querySelector(`[data-key="${key}"]`);if(!card)return;grid().querySelectorAll('.landing-dish').forEach(c=>c.classList.toggle('selected',c===card));};
  window.startFromLanding=function(key,live){if(!live){if(typeof toast==='function')toast('This dish is coming soon.');return;}pendingDish=key;window.openLandingLogin();};
  window.showEmailLogin=function(){document.getElementById('landing-auth-choices')?.setAttribute('hidden','');document.getElementById('login-form')?.removeAttribute('hidden');setTimeout(()=>document.getElementById('email')?.focus(),100);};
  window.showAuthChoices=function(){document.getElementById('landing-auth-choices')?.removeAttribute('hidden');document.getElementById('login-form')?.setAttribute('hidden','');};
  window.landingProviderLogin=function(provider){
    const note=document.getElementById('landing-auth-note');
    if(note)note.textContent=`Connecting your ${provider} kitchen…`;
    document.querySelectorAll('.landing-provider').forEach(button=>button.disabled=true);
    setTimeout(()=>{
      if(typeof T!=='undefined'){
        const isGoogle=provider==='Google';
        T.nick=isGoogle?'Google cook':'Apple cook';
        T.email=isGoogle?'google@washoku.preview':'apple@washoku.preview';
        T.pw='';T.loginAt=Date.now();
        if(typeof eset==='function'){eset('washoku_nick',T.nick);eset('washoku_email',T.email);}
      }
      if(typeof setGreeting==='function')setGreeting();
      window.closeLandingLogin(true);
      if(typeof go==='function')go('home');
      if(typeof toast==='function')toast(`Welcome to WASHOKU · ${provider}`);
      document.querySelectorAll('.landing-provider').forEach(button=>button.disabled=false);
      if(note)note.textContent='';
    },520);
  };
  window.openLandingLogin=function(){const modal=document.getElementById('landing-login-modal');if(!modal)return;window.showAuthChoices();modal.classList.add('on');modal.setAttribute('aria-hidden','false');};
  window.closeLandingLogin=function(keepDestination=false){const modal=document.getElementById('landing-login-modal');if(!modal)return;modal.classList.remove('on');modal.setAttribute('aria-hidden','true');if(!keepDestination)window.communityLoginPending=false;};
  window.toggleLandingLanguage=function(button){const wrap=button.closest('.landing-language');const open=!wrap.classList.contains('open');wrap.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));};
  window.landingSoon=function(name){document.querySelector('.landing-language')?.classList.remove('open');if(typeof toast==='function')toast(`${name} is coming soon.`);};
  window.toggleLandingMenu=function(button){const menu=document.getElementById('landing-menu');if(!menu)return;const open=!menu.classList.contains('open');menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));document.querySelector('.landing-menu-toggle')?.setAttribute('aria-expanded',String(open));};
  window.landingNav=function(id){
    const ids=['home','dishes','how','community'];
    document.querySelectorAll('#landing-menu nav button').forEach((button,index)=>{const active=ids[index]===id;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    document.getElementById('landing-menu')?.classList.remove('open');
    document.querySelector('.landing-menu-toggle')?.setAttribute('aria-expanded','false');
    if(id==='dishes'){window.openLandingLogin();return;}
    if(id==='how'){if(typeof toast==='function')toast('How it works is coming soon.');return;}
    if(id==='community'){go('community');return;}
    document.getElementById('landing-home')?.scrollIntoView({behavior:'smooth',block:'center'});
  };
  document.addEventListener('DOMContentLoaded',function(){
    // The module owns the refrigerator, its dishes, and its single opening timeline.
    // Login must also open over the public community, outside the hidden landing screen.
    const loginModal=document.getElementById('landing-login-modal');
    if(loginModal)document.body.appendChild(loginModal);
    for(const name of ['pulseReact','celebrateReact','reportPost','submitReport','addToWantToCook']){
      const action=window[name];
      if(typeof action==='function')window[name]=function(...args){
        if(!T.nick){window.communityLoginPending=true;window.openLandingLogin();if(typeof toast==='function')toast('Log in to interact with the community.');return;}
        return action.apply(this,args);
      };
    }
    const originalGo=window.go;
    window.go=function(view){
      if(T.nick&&window.communityLoginPending&&view==='home'){view='community';window.communityLoginPending=false;}
      return originalGo(view);
    };
    document.getElementById('landing-login-modal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)window.closeLandingLogin();});
    const originalStart=window.startTest;
    if(typeof originalStart==='function')window.startTest=function(){const result=originalStart();if(T&&T.nick&&pendingDish==='omurice'){pendingDish='';window.closeLandingLogin();setTimeout(()=>go('dish'),0);}return result;};
  });
})();
