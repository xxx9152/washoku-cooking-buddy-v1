(() => {
  const addClose = (modalId) => {
    const modal = document.getElementById(modalId);
    const card = modal?.querySelector('.pcard');
    if (!modal || !card || card.querySelector('.modal-close')) return;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'modal-close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    close.addEventListener('click', () => modal.classList.remove('on'));
    card.prepend(close);
  };

  const initialise = () => {
    // Screen changes replace the welcome page, rather than scrolling past it.
    const login=document.getElementById('screen-login');
    if(login){
      let wasActive=login.classList.contains('on');
      new MutationObserver(()=>{
        const active=login.classList.contains('on');
        if(wasActive&&!active){
          document.getElementById('landing-login-modal')?.classList.remove('on');
          document.getElementById('landing-login-modal')?.setAttribute('aria-hidden','true');
          document.documentElement.style.scrollBehavior='auto';
          window.scrollTo({top:0,left:0,behavior:'instant'});
          requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
        }
        wasActive=active;
      }).observe(login,{attributes:true,attributeFilter:['class']});
    }
    const communityIcon = document.querySelector('button[aria-label="Community"] .quick-icon');
    if (communityIcon) communityIcon.textContent = '🌍';
    addClose('share-modal');
    addClose('report-modal');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise);
  else initialise();
})();
