(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Navigation links exported by Wix already carry local fragment targets.
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
    closeMenu();
  }));

  const openButton = $('.wixui-hamburger-open-button');
  const closeButton = $('.wixui-hamburger-close-button');
  const menuRoot = openButton?.closest('[data-mesh-id]') || openButton?.parentElement?.parentElement;
  let menuPanel = document.getElementById('comp-kbgakxea_r_comp-mpuineua5');
  if(menuPanel && !menuPanel.querySelector('.standalone-mobile-nav')){
    const nav=document.createElement('nav');nav.className='standalone-mobile-nav';nav.setAttribute('aria-label','Site navigation');
    nav.innerHTML='<a href="#comp-mpufoso712">THE STORY</a><a href="#comp-mpuix9j9">KEY DISCOVERIES</a><a href="#comp-ly44x60h">AUTHENTICATION</a>';
    Object.assign(nav.style,{position:'fixed',inset:'0 0 0 40%',zIndex:'9998',background:'#fefcf6',padding:'150px 26px 80px',display:'flex',flexDirection:'column',gap:'24px',boxSizing:'border-box'});
    [...nav.children].forEach(a=>Object.assign(a.style,{color:'#292720',fontSize:'20px',textDecoration:'none',fontFamily:'Arial,sans-serif'}));
    menuPanel.prepend(nav);
  }
  const setMenu = open => {
    if (!menuPanel) return;
    menuPanel.hidden = !open;
    menuPanel.style.display = open ? 'block' : 'none';
    menuPanel.style.visibility = open ? 'visible' : 'hidden';
    menuPanel.querySelectorAll('[class*="overflow-wrapper"]').forEach(x=>x.style.transform='none');
    menuPanel.setAttribute('aria-hidden', String(!open));
    let p=closeButton;
    while(p && p!==menuPanel){p.style.display=open?(p.tagName==='BUTTON'?'block':'grid'):'';p=p.parentElement;}
    openButton?.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('standalone-menu-open', open);
    if (open) closeButton?.focus();
  };
  const closeMenu = () => setMenu(false);
  openButton?.addEventListener('click', () => setMenu(true));
  closeButton?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
  if (menuPanel) setMenu(false);
  $$('.standalone-mobile-nav a').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});closeMenu()}}));

  // Rebuild the original five-image draggable gallery as plain browser code.
  const gallery = $('caravaggio-gallery');
  if (gallery) {
    const sources = [
      ['assets/c5e2a4ca918c3c95.png','Caravaggio 1'],
      ['assets/32c877ebccff5a14.png','Caravaggio 2'],
      ['assets/0685be26bbf3c14a.png','Caravaggio 3'],
      ['assets/11cd5053df965e7c.jpg','Caravaggio X-ray'],
      ['assets/e0788182efd12c9d.jpg','Caravaggio ultraviolet detail']
    ];
    gallery.innerHTML = `<div class="standalone-gallery"><button class="standalone-gallery__nav standalone-gallery__prev" aria-label="Previous image">❮</button><div class="standalone-gallery__viewport"><div class="standalone-gallery__track">${sources.map(([src,alt])=>`<div class="standalone-gallery__slide"><img src="${src}" alt="${alt}" loading="lazy" draggable="false"></div>`).join('')}</div></div><button class="standalone-gallery__nav standalone-gallery__next" aria-label="Next image">❯</button></div>`;
    const viewport = $('.standalone-gallery__viewport', gallery), track = $('.standalone-gallery__track', gallery);
    let index=0, startX=0, dragX=0, dragging=false;
    const maxIndex = () => Math.max(0, sources.length - Math.max(1, Math.floor(viewport.clientWidth / ($('.standalone-gallery__slide',gallery).clientWidth + 20))));
    const width = () => $('.standalone-gallery__slide',gallery).clientWidth + (innerWidth <= 600 ? 12 : 20);
    const render = extra => track.style.transform = `translate3d(${-index*width() + (extra||0)}px,0,0)`;
    $('.standalone-gallery__prev',gallery).onclick=()=>{index=Math.max(0,index-1);render()};
    $('.standalone-gallery__next',gallery).onclick=()=>{index=Math.min(maxIndex(),index+1);render()};
    viewport.onpointerdown=e=>{dragging=true;startX=e.clientX;dragX=0;track.style.transition='none';viewport.setPointerCapture(e.pointerId)};
    viewport.onpointermove=e=>{if(!dragging)return;dragX=e.clientX-startX;render(dragX)};
    viewport.onpointerup=()=>{if(!dragging)return;dragging=false;track.style.transition='';if(Math.abs(dragX)>50)index=Math.max(0,Math.min(maxIndex(),index+(dragX<0?1:-1)));render()};
    addEventListener('resize',()=>{index=Math.min(index,maxIndex());render()});
  }

  // Original animation definitions, mapped to native Web Animations.
  const data = window.CARAVAGGIO_MOTION;
  const matches = r => innerWidth >= (r.min || 0) && innerWidth <= (r.max || Infinity);
  const choose = defs => defs.filter(d => !(d.variants || []).length || d.variants.some(matches)).at(-1);
  const clamp = n => Math.max(0,Math.min(1,n));
  const frames = effect => {
    const n = effect.namedEffect, out = n.range === 'out';
    let from={},to={};
    switch(n.type){
      case 'TiltIn': from={opacity:0,transform:`perspective(1000px) rotateY(${n.direction==='left'?-25:25}deg) translateX(${n.direction==='left'?-40:40}px)`};to={opacity:1,transform:'perspective(1000px) rotateY(0deg) translateX(0px)'};break;
      case 'FadeScroll': from={opacity:out?1:(n.opacity??0)};to={opacity:out?(n.opacity??0):1};break;
      case 'ShrinkScroll': from={transform:`scale(${n.scale||1.7})`};to={transform:'scale(1)'};break;
      case 'TurnScroll': from={transform:'rotate(0deg) scale(1)'};to={transform:`rotate(${n.direction==='left'?-35:35}deg) scale(${n.scale||1})`};break;
      case 'MoveScroll': {const angle=(n.angle||0)*Math.PI/180, distance=n.distance?.value || n.distance || 80;const shift=`translate(${Math.cos(angle)*distance}px,${Math.sin(angle)*distance}px)`;from={transform:out?'translate(0,0)':shift};to={transform:out?shift:'translate(0,0)'};break;}
      case 'ImageParallax': from={transform:'translateY(-4%) scale(1.08)'};to={transform:'translateY(4%) scale(1.08)'};break;
      default:return null;
    }
    return [from,to];
  };
  let scrubs=[], entrances=[], io;
  const configureMotion = () => {
    scrubs.forEach(x=>x.animation.cancel());entrances.forEach(x=>x.animation.cancel());io?.disconnect();scrubs=[];entrances=[];
    io = new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){const item=entrances.find(a=>a.element===x.target);item?.animation.play();io.unobserve(x.target)}}),{threshold:.05});
    for(const [sourceId,events] of Object.entries(data?.triggers||{})){
      const source=document.getElementById(sourceId);if(!source)continue;
      for(const [event,targets] of Object.entries(events))for(const [targetId,groups] of Object.entries(targets)){
        const element=document.getElementById(targetId);if(!element)continue;
        for(const group of groups.filter(g=>matches(g.triggerBpRange||{})))for(const reaction of group.reactions||[]){
          const effect=choose(data.effects[targetId]?.[reaction.reactionData?.effect]||[]);if(!effect?.namedEffect)continue;
          const keyframes=frames(effect);if(!keyframes)continue;
          const animation=element.animate(keyframes,{duration:event==='view-progress'?1000:effect.duration||1200,delay:event==='view-progress'?0:effect.delay||0,fill:'both',easing:event==='view-progress'?'linear':'cubic-bezier(.22,1,.36,1)'});animation.pause();
          if(event==='view-progress')scrubs.push({element,source,effect,animation});
          else if(event==='viewport-enter'){entrances.push({element,animation});io.observe(element)}
          else animation.cancel();
        }
      }
    }
    updateMotion();
  };
  const top = el => {let y=0;while(el){y+=el.offsetTop||0;el=el.offsetParent}return y};
  const updateMotion = () => scrubs.forEach(({source,effect,animation})=>{
    const progress=(scrollY+innerHeight-top(source))/(innerHeight+source.offsetHeight);
    const begin=(effect.startOffset?.offset?.value||0)/100,end=(effect.endOffset?.offset?.value??100)/100;
    animation.currentTime=clamp((progress-begin)/(end-begin||1))*1000;
  });
  let ticking=false;
  addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{updateMotion();ticking=false})},{passive:true});
  addEventListener('resize',configureMotion);
  configureMotion();
  const marquee=$('[data-marquee-animation]'), toggle=$('[aria-label="Play Marquee"]');
  if(marquee && toggle){
    const animation=marquee.animate([{transform:'translateX(0)'},{transform:'translateX(-50%)'}],{duration:30000,iterations:Infinity,easing:'linear'});
    let playing=true;toggle.setAttribute('aria-label','Pause Marquee');toggle.setAttribute('aria-pressed','true');
    toggle.addEventListener('click',()=>{playing=!playing;playing?animation.play():animation.pause();toggle.setAttribute('aria-label',playing?'Pause Marquee':'Play Marquee');toggle.setAttribute('aria-pressed',String(playing))});
  }
})();