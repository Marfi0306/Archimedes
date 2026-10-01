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
  let menuAnimation;
  const setMenu = open => {
    if (!menuPanel) return;
    menuAnimation?.cancel();
    const nav = $('.standalone-mobile-nav', menuPanel);
    if (open) {
      menuPanel.hidden = false;
      menuPanel.style.display = 'block';
      menuPanel.style.visibility = 'visible';
    }
    menuPanel.querySelectorAll('[class*="overflow-wrapper"]').forEach(x=>x.style.transform='none');
    menuPanel.setAttribute('aria-hidden', String(!open));
    let p=closeButton;
    while(p && p!==menuPanel){p.style.display=open?(p.tagName==='BUTTON'?'block':'grid'):'';p=p.parentElement;}
    openButton?.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('standalone-menu-open', open);
    if (open) {
      closeButton?.focus();
      if (nav && !matchMedia('(prefers-reduced-motion: reduce)').matches)
        menuAnimation = nav.animate([{transform:'translateX(100%)',opacity:.7},{transform:'translateX(0)',opacity:1}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    } else if (nav && !menuPanel.hidden && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      menuAnimation = nav.animate([{transform:'translateX(0)',opacity:1},{transform:'translateX(100%)',opacity:.7}],{duration:300,easing:'ease-in',fill:'both'});
      menuAnimation.onfinish = () => { menuPanel.hidden = true; menuPanel.style.display = 'none'; menuPanel.style.visibility = 'hidden'; };
    } else {
      menuPanel.hidden = true;
      menuPanel.style.display = 'none';
      menuPanel.style.visibility = 'hidden';
    }
  };
  const closeMenu = () => setMenu(false);
  openButton?.addEventListener('click', () => setMenu(true));
  closeButton?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
  if (menuPanel) { menuPanel.hidden = true; setMenu(false); }
  $$('.standalone-mobile-nav a').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});closeMenu()}}));

  // The Wix export contains separate desktop and mobile galleries. Rebuild each
  // carousel from its original assets, preserving its respective card geometry.
  const mobileGallery = $('caravaggio-gallery');
  const desktopGallery = $('#gallery-wrapper-comp-mpvibs9m6');
  const mobileSources = [
    ['assets/c5e2a4ca918c3c95.png','Archimedes, full painting'],
    ['assets/32c877ebccff5a14.png','Detail of Archimedes'],
    ['assets/0685be26bbf3c14a.png','Close-up of Archimedes'],
    ['assets/11cd5053df965e7c.jpg','X-ray of the painting'],
    ['assets/e0788182efd12c9d.jpg','Ultraviolet examination']
  ];
  const desktopSources = [
    ['assets/b619befecf88c520.webp','Archimedes, full painting'],
    ['assets/3dae69f032214ed3.webp','Detail of Archimedes'],
    ['assets/ceb427969192c664.webp','Close-up of Archimedes'],
    ['assets/60b7abc407782c0c.webp','X-ray of the painting'],
    ['assets/70642b91e307cb7b.webp','Ultraviolet examination']
  ];
  const lightbox = document.createElement('dialog');
  lightbox.className = 'standalone-lightbox';
  lightbox.innerHTML = '<button class="standalone-lightbox__close" type="button" aria-label="Close image">×</button><button class="standalone-lightbox__prev" type="button" aria-label="Previous image">‹</button><img alt=""><button class="standalone-lightbox__next" type="button" aria-label="Next image">›</button>';
  document.body.append(lightbox);
  let lightboxSources = [], lightboxIndex = 0;
  const showLightboxImage = () => {
    const image = $('img', lightbox);
    [image.src, image.alt] = lightboxSources[lightboxIndex];
  };
  const moveLightbox = direction => {
    lightboxIndex = (lightboxIndex + direction + lightboxSources.length) % lightboxSources.length;
    showLightboxImage();
  };
  $('.standalone-lightbox__close', lightbox).onclick = () => lightbox.close();
  $('.standalone-lightbox__prev', lightbox).onclick = () => moveLightbox(-1);
  $('.standalone-lightbox__next', lightbox).onclick = () => moveLightbox(1);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') moveLightbox(e.key === 'ArrowRight' ? 1 : -1);
  });
  const makeGallery = (root, sources, mode) => {
    if (!root) return;
    root.innerHTML = `<div class="standalone-gallery standalone-gallery--${mode}" role="region" aria-label="Artwork gallery" tabindex="0"><div class="standalone-gallery__viewport"><div class="standalone-gallery__track">${sources.map(([src,alt])=>`<div class="standalone-gallery__slide"><img src="${src}" alt="${alt}" loading="lazy" draggable="false"></div>`).join('')}</div></div><button type="button" class="standalone-gallery__nav standalone-gallery__prev" aria-label="Previous image">‹</button><button type="button" class="standalone-gallery__nav standalone-gallery__next" aria-label="Next image">›</button></div>`;
    const gallery = $('.standalone-gallery', root);
    const viewport = $('.standalone-gallery__viewport', root);
    const track = $('.standalone-gallery__track', root);
    const slides = $$('.standalone-gallery__slide', root);
    const prev = $('.standalone-gallery__prev', root);
    const next = $('.standalone-gallery__next', root);
    let index = 0, startX = 0, deltaX = 0, pointerId = null, dragged = false;
    const step = () => slides[1]?.offsetLeft - slides[0]?.offsetLeft || slides[0]?.offsetWidth || 1;
    const maxIndex = () => mode === 'desktop' ? Math.max(0, slides.length - 3) : slides.length - 1;
    const render = (drag = 0) => {
      track.style.transform = `translate3d(${-(index * step()) + drag}px,0,0)`;
    };
    const go = direction => { index = (index + direction + maxIndex() + 1) % (maxIndex() + 1); render(); };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); }
    });
    viewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; deltaX = 0; dragged = false;
      track.style.transition = 'none'; viewport.setPointerCapture(pointerId);
    });
    viewport.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      deltaX = e.clientX - startX;
      render(deltaX);
    });
    const finish = e => {
      if (pointerId !== e.pointerId) return;
      pointerId = null; track.style.transition = '';
      if (Math.abs(deltaX) > 35) { dragged = true; go(deltaX < 0 ? 1 : -1); }
      else render();
    };
    viewport.addEventListener('pointerup', finish);
    viewport.addEventListener('pointercancel', finish);
    track.addEventListener('click', e => {
      const slide = e.target.closest('.standalone-gallery__slide');
      if (!slide || dragged) { dragged = false; return; }
      lightboxSources = sources;
      lightboxIndex = slides.indexOf(slide);
      showLightboxImage();
      lightbox.showModal();
    });
    addEventListener('resize', () => { index = Math.min(index, maxIndex()); render(); });
    render();
  };
  makeGallery(mobileGallery, mobileSources, 'mobile');
  makeGallery(desktopGallery, desktopSources, 'desktop');

  // Recreate the exported Wix timelines using their actual breakpoint variants.
  const motion = window.CARAVAGGIO_MOTION;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const inRange = range => innerWidth >= (range?.min ?? 0) && innerWidth <= (range?.max ?? Infinity);
  const pickEffect = definitions => {
    if (!definitions?.length) return null;
    const variants = definitions.slice(1).filter(def => def.variants?.some(inRange));
    if (!variants.length) return definitions[0];
    variants.sort((a, b) => {
      const width = def => Math.min(...def.variants.filter(inRange).map(r => (r.max ?? Infinity) - (r.min ?? 0)));
      return width(a) - width(b);
    });
    // A Wix variant with no namedEffect intentionally disables that animation.
    return variants[0];
  };
  const clamp = value => Math.max(0, Math.min(1, value));
  const keyframesFor = (effect, element) => {
    const n = effect.namedEffect;
    const out = n.range === 'out';
    switch (n.type) {
      case 'TiltIn': {
        const depth = element.getBoundingClientRect().height / 2;
        const pivot = `50% 50% -${depth}px`;
        return {target:element, tracks:[
          {frames:[{opacity:0},{opacity:1}], duration:(effect.duration ?? 1200) * .2, easing:'cubic-bezier(.215,.61,.355,1)'},
          {frames:[
            {transform:`perspective(800px) rotateX(-90deg) rotateZ(${n.direction === 'left' ? 30 : -30}deg)`, transformOrigin:pivot},
            {transform:'perspective(800px) rotateX(0deg) rotateZ(0deg)', transformOrigin:pivot}
          ], duration:effect.duration ?? 1200, easing:'cubic-bezier(.215,.61,.355,1)'},
          {frames:[{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0 0 0 0)'}], duration:(effect.duration ?? 1200) * .8, easing:'cubic-bezier(.215,.61,.355,1)'}
        ]};
      }
      case 'FadeScroll': return {target:element, tracks:[{frames:[{opacity:out ? 1 : (n.opacity ?? 0)}, {opacity:out ? (n.opacity ?? 0) : 1}]}]};
      case 'ShrinkScroll': return {target:element, tracks:[{frames:[{transform:`scale(${n.scale ?? 1.2})`}, {transform:'scale(1)'}], easing:'cubic-bezier(.47,0,.745,.715)'}]};
      case 'TurnScroll': {
        const bounds = element.getBoundingClientRect();
        const offscreenX = n.direction === 'left' ? innerWidth - bounds.left : -bounds.left - bounds.width;
        const rotation = n.spin === 'clockwise' ? 45 : -45;
        return {target:element, tracks:[{frames:[
          {transform:'translateX(0px) scale(1) rotate(0deg)'},
          {transform:`translateX(${offscreenX}px) scale(${n.scale ?? 1}) rotate(${rotation}deg)`}
        ]}]};
      }
      case 'MoveScroll': {
        // Wix measures angles from the vertical axis.
        const angle = ((n.angle ?? 210) - 90) * Math.PI / 180;
        const distance = n.distance?.value ?? 80;
        const moved = `translate(${Math.round(Math.cos(angle) * distance)}px,${Math.round(Math.sin(angle) * distance)}px)`;
        return {target:element, tracks:[{frames:[{transform:out ? 'translate(0,0)' : moved}, {transform:out ? moved : 'translate(0,0)'}]}]};
      }
      case 'ImageParallax': {
        const media = element.querySelector('[data-motion-part~="BG_MEDIA"]');
        if (!media) return null;
        const travel = -100 * ((n.speed ?? 1.5) - 1) / (n.speed ?? 1.5);
        return {target:media, tracks:[{frames:[{transform:`translateY(${travel}%)`},{transform:'translateY(0%)'}]}]};
      }
      default: return null;
    }
  };
  let scrubs = [], timed = [], observer;
  const played = new Set();
  const layoutTop = element => {
    let y = 0;
    for (let node = element; node; node = node.offsetParent) y += node.offsetTop || 0;
    return y;
  };
  const updateMotion = () => {
    for (const {source, effect, animations} of scrubs) {
      const cover = (scrollY + innerHeight - layoutTop(source)) / (innerHeight + source.offsetHeight);
      const start = (effect.startOffset?.offset?.value ?? 0) / 100;
      const end = (effect.endOffset?.offset?.value ?? 100) / 100;
      const currentTime = clamp((cover - start) / (end - start || 1)) * 1000;
      animations.forEach(animation => { animation.currentTime = currentTime; });
    }
  };
  const configureMotion = () => {
    observer?.disconnect();
    [...scrubs, ...timed].forEach(item => item.animations.forEach(animation => animation.cancel()));
    scrubs = []; timed = [];
    if (!motion?.triggers || reducedMotion.matches) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const item of timed.filter(item => item.source === entry.target)) {
          item.start();
          played.add(item.key);
        }
        observer.unobserve(entry.target);
      }
    }, {rootMargin:'0px 0px -5% 0px', threshold:0.01});
    const seen = new Set();
    for (const [sourceId, events] of Object.entries(motion.triggers)) {
      const source = document.getElementById(sourceId);
      if (!source) continue;
      for (const [event, targets] of Object.entries(events)) {
        if (event !== 'view-progress' && event !== 'viewport-enter') continue;
        for (const [targetId, groups] of Object.entries(targets)) {
          const element = document.getElementById(targetId);
          if (!element) continue;
          for (const group of groups) {
            if (!inRange(group.triggerBpRange)) continue;
            for (const reaction of group.reactions || []) {
              const effectId = reaction.reactionData?.effect;
              const key = `${event}:${sourceId}:${targetId}:${effectId}`;
              if (seen.has(key)) continue;
              seen.add(key);
              const effect = pickEffect(motion.effects[targetId]?.[effectId]);
              if (!effect?.namedEffect) continue;
              const definition = keyframesFor(effect, element);
              if (!definition) continue;
              const createAnimations = () => definition.tracks.map(track => {
                const animation = definition.target.animate(track.frames, {
                  duration:event === 'view-progress' ? 1000 : (track.duration ?? effect.duration ?? 1200),
                  delay:event === 'view-progress' ? 0 : (effect.delay ?? 0),
                  easing:track.easing ?? 'linear',
                  fill:event === 'view-progress' ? 'both' : 'backwards'
                });
                if (event === 'view-progress') animation.pause();
                else animation.onfinish = () => animation.cancel();
                return animation;
              });
              if (event === 'view-progress') scrubs.push({source, effect, animations:createAnimations()});
              else if (!played.has(key)) {
                // Observe the resting geometry before TiltIn clips and rotates it.
                // Creating a paused entrance first can prevent intersection forever.
                const item = {source, animations:[], key, start() {
                  if (!this.animations.length) this.animations = createAnimations();
                }};
                timed.push(item);
                observer.observe(source);
              }
            }
          }
        }
      }
    }
    updateMotion();
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateMotion(); ticking = false; });
  }, {passive:true});
  let breakpoint = innerWidth <= 750 ? 0 : innerWidth <= 1000 ? 1 : 2;
  addEventListener('resize', () => {
    const next = innerWidth <= 750 ? 0 : innerWidth <= 1000 ? 1 : 2;
    if (next !== breakpoint) { breakpoint = next; configureMotion(); }
    else updateMotion();
  });
  reducedMotion.addEventListener('change', configureMotion);
  configureMotion();
  if (window.Lenis && !reducedMotion.matches) {
    const lenis = new window.Lenis({lerp:.27, wheelMultiplier:.9});
    const frame = time => { lenis.raf(time); requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  }
  const marquee = $('.wixui-text-marquee .mwhagG');
  const toggle = $('.wixui-text-marquee [aria-label="Play Marquee"]');
  if (marquee && toggle && !reducedMotion.matches) {
    const animation = marquee.animate(
      [{transform:'translateX(0)'},{transform:'translateX(-50%)'}],
      {duration:40000,iterations:Infinity,easing:'linear'}
    );
    let playing = true;
    const updateToggle = () => {
      toggle.setAttribute('aria-label', playing ? 'Pause Marquee' : 'Play Marquee');
      toggle.setAttribute('aria-pressed', String(playing));
      playing ? animation.play() : animation.pause();
    };
    toggle.addEventListener('click', () => { playing = !playing; updateToggle(); });
    marquee.closest('.wixui-text-marquee')?.addEventListener('pointerenter', () => animation.pause());
    marquee.closest('.wixui-text-marquee')?.addEventListener('pointerleave', () => { if (playing) animation.play(); });
    updateToggle();
  }
})();
