(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Wix subtracts the scrollbar from each component's individual fluid preset.
  const updateScrollbarWidth = () => {
    if (!document.documentElement.classList.contains('standalone-menu-open') &&
        !document.documentElement.classList.contains('lightbox-open')) {
      document.body.style.setProperty('--scrollbar-width', `${innerWidth - document.documentElement.clientWidth}px`);
    }
  };
  updateScrollbarWidth();
  addEventListener('resize', updateScrollbarWidth);

  for (const sectionId of ['comp-lxun76he','comp-mpuj9y3c']) {
    const section = document.getElementById(sectionId);
    section?.querySelectorAll('.wixui-image a').forEach(link => {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = link.className;
      imageWrapper.append(...link.childNodes);
      link.replaceWith(imageWrapper);
    });
  }

  const tabletHero = document.querySelector('#comp-mpufoso1 img');
  const tabletHeroMedia = document.querySelector('#comp-mpufoso1 [data-motion-part~="BG_MEDIA"]');
  const defaultHeroSource = tabletHero?.getAttribute('src');
  const updateTabletHero = () => {
    if (!tabletHero || !tabletHeroMedia) return;
    let src = defaultHeroSource;
    if (innerWidth > 750 && innerWidth <= 1000) {
      // Wix crops to the parallax media frame before applying its focal point.
      const density = Math.min(devicePixelRatio || 1, 2);
      const width = Math.round(tabletHeroMedia.offsetWidth * density);
      const height = Math.round(tabletHeroMedia.offsetHeight * density);
      src = `https://static.wixstatic.com/media/de1bc2_1c32d89e18674e87a46348a221377a9f~mv2.png/v1/fill/w_${width},h_${height},fp_0.40_0.34,q_90,usm_0.66_1.00_0.01,enc_webp,quality_auto/EdWrightImages_-2292_tif.webp`;
    }
    if (tabletHero.getAttribute('src') !== src) tabletHero.src = src;
  };
  updateTabletHero();
  addEventListener('resize', updateTabletHero);

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
    nav.innerHTML='<a href="#comp-mpvmnaf7">THE STORY</a><a href="#comp-mpuix9j9">KEY DISCOVERIES</a><a href="#comp-ly44x60h">AUTHENTICATION</a>';
    Object.assign(nav.style,{position:'fixed',inset:'0 0 0 40%',zIndex:'9998',background:'#fefcf6',padding:'150px 26px 80px',display:'flex',flexDirection:'column',gap:'24px',boxSizing:'border-box'});
    [...nav.children].forEach(a=>Object.assign(a.style,{color:'#292720',fontSize:'20px',textDecoration:'none',fontFamily:'Arial,sans-serif'}));
    menuPanel.prepend(nav);
    if (closeButton) {
      const closeWrapper = closeButton.parentElement;
      nav.append(closeWrapper);
      Object.assign(closeWrapper.style,{position:'absolute',top:'20px',right:'24px',zIndex:'9999'});
    }
    const social = document.getElementById('comp-kbgakxea_r_comp-mpuineue5');
    if (social) {
      nav.append(social);
      Object.assign(social.style,{position:'absolute',bottom:'40px',left:'26px',width:'auto',display:'block'});
      social.querySelectorAll('img').forEach((image,index)=>image.src=index===0?'assets/instagram.webp':'assets/youtube.webp');
    }
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
    while(p && p!==menuPanel && p!==nav){p.style.display=open?(p.tagName==='BUTTON'?'block':'grid'):'';p=p.parentElement;}
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
  menuPanel?.addEventListener('click', e => { if (e.target === menuPanel || e.target.matches('[data-hook="hamburger-overlay-dialog"]')) closeMenu(); });
  document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
  if (menuPanel) { menuPanel.hidden = true; setMenu(false); }
  $$('.standalone-mobile-nav a').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});closeMenu()}}));

  // The Wix export contains separate desktop and mobile galleries. Rebuild each
  // carousel from its original assets, preserving its respective card geometry.
  const mobileGallery = $('caravaggio-gallery');
  const desktopGallery = $('#gallery-wrapper-comp-mpvibs9m6');
  const mobileSources = [
    ['assets/b619befecf88c520.webp','Archimedes, full painting'],
    ['assets/3dae69f032214ed3.webp','Detail of Archimedes'],
    ['assets/ceb427969192c664.webp','Close-up of Archimedes'],
    ['assets/60b7abc407782c0c.webp','X-ray of the painting'],
    ['assets/70642b91e307cb7b.webp','Ultraviolet examination']
  ];
  const desktopSources = [
    ['assets/b619befecf88c520.webp','Archimedes, full painting'],
    ['assets/3dae69f032214ed3.webp','Detail of Archimedes'],
    ['assets/ceb427969192c664.webp','Close-up of Archimedes'],
    ['assets/60b7abc407782c0c.webp','X-ray of the painting'],
    ['assets/70642b91e307cb7b.webp','Ultraviolet examination']
  ];
  const chevron = direction => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${direction === 'prev' ? 'M14 6l-6 6 6 6' : 'M10 6l6 6-6 6'}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  // Thumbnails stay small; the modal loads the original uncropped Wix image.
  const fullImageSources = [
    'https://static.wixstatic.com/media/920c1a_2b25798893fb4948851e352abe08b782~mv2.webp',
    'https://static.wixstatic.com/media/920c1a_12ebd11724274a558f943824f3993700~mv2.webp',
    'https://static.wixstatic.com/media/920c1a_d472d8dc145242398a281500b4f14980~mv2.webp',
    'https://static.wixstatic.com/media/920c1a_ba0559f7b5114e1da482aae38e0ee0aa~mv2.webp',
    'https://static.wixstatic.com/media/920c1a_63a8b9cb54694bb39aab0cad88cfbcf5~mv2.webp'
  ];
  const lightbox = document.createElement('dialog');
  lightbox.className = 'standalone-lightbox';
  lightbox.setAttribute('aria-label', 'Artwork image viewer');
  lightbox.setAttribute('data-lenis-prevent', '');
  lightbox.innerHTML = `<div class="standalone-lightbox__stage"><img alt="" draggable="false"></div><div class="standalone-lightbox__tools"><button type="button" aria-label="Zoom out">−</button><button type="button" aria-label="Reset zoom">100%</button><button type="button" aria-label="Zoom in">+</button><button class="standalone-lightbox__close" type="button" aria-label="Close image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></button></div><button class="standalone-lightbox__prev" type="button" aria-label="Previous image">${chevron('prev')}</button><button class="standalone-lightbox__next" type="button" aria-label="Next image">${chevron('next')}</button>`;
  document.body.append(lightbox);
  const stage = $('.standalone-lightbox__stage', lightbox);
  const lightboxImage = $('img', lightbox);
  const zoomLabel = $('[aria-label="Reset zoom"]', lightbox);
  let lightboxSources = [], lightboxIndex = 0, zoom = 1, panX = 0, panY = 0;
  let panOrigin = null, pointerMoved = false, returnFocus = null, startedOnBackdrop = false;
  const pointers = new Map();
  const renderZoom = () => {
    const limitX = Math.max(0, (lightboxImage.offsetWidth * zoom - stage.clientWidth) / 2);
    const limitY = Math.max(0, (lightboxImage.offsetHeight * zoom - stage.clientHeight) / 2);
    panX = Math.max(-limitX, Math.min(limitX, panX));
    panY = Math.max(-limitY, Math.min(limitY, panY));
    lightboxImage.style.transform = `translate3d(${panX}px,${panY}px,0) scale(${zoom})`;
    stage.classList.toggle('is-zoomed', zoom > 1);
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    $('[aria-label="Zoom out"]', lightbox).disabled = zoom <= 1;
    $('[aria-label="Zoom in"]', lightbox).disabled = zoom >= 4;
  };
  const setZoom = value => { zoom = Math.max(1, Math.min(4, value)); renderZoom(); };
  const resetZoom = () => { zoom = 1; panX = panY = 0; renderZoom(); };
  const showLightboxImage = () => {
    resetZoom();
    lightboxImage.src = fullImageSources[lightboxIndex];
    lightboxImage.alt = lightboxSources[lightboxIndex][1];
  };
  lightboxImage.addEventListener('load', renderZoom);
  const moveLightbox = direction => {
    lightboxIndex = (lightboxIndex + direction + lightboxSources.length) % lightboxSources.length;
    showLightboxImage();
  };
  $('[aria-label="Zoom in"]', lightbox).onclick = () => setZoom(zoom + .5);
  $('[aria-label="Zoom out"]', lightbox).onclick = () => setZoom(zoom - .5);
  zoomLabel.onclick = resetZoom;
  $('.standalone-lightbox__close', lightbox).onclick = () => lightbox.close();
  $('.standalone-lightbox__prev', lightbox).onclick = () => moveLightbox(-1);
  $('.standalone-lightbox__next', lightbox).onclick = () => moveLightbox(1);
  lightbox.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    pointers.clear(); resetZoom(); returnFocus?.focus({preventScroll:true});
  });
  stage.addEventListener('click', e => { if (e.target === stage && startedOnBackdrop && !pointerMoved) lightbox.close(); });
  stage.addEventListener('dblclick', () => { if (!startedOnBackdrop) setZoom(zoom > 1 ? 1 : 2); });
  stage.addEventListener('wheel', e => {
    e.preventDefault(); e.stopPropagation();
    setZoom(zoom * Math.exp(-e.deltaY * .002));
  }, {passive:false});
  stage.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startedOnBackdrop = e.target === stage;
    pointers.set(e.pointerId, {x:e.clientX,y:e.clientY});
    pointerMoved = false;
    panOrigin = {x:e.clientX,y:e.clientY,panX,panY,zoom};
    if (pointers.size === 2) {
      const [a,b] = [...pointers.values()];
      panOrigin.distance = Math.hypot(a.x-b.x,a.y-b.y);
    }
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId) || !panOrigin) return;
    pointers.set(e.pointerId, {x:e.clientX,y:e.clientY});
    const dx = e.clientX-panOrigin.x, dy = e.clientY-panOrigin.y;
    if (Math.hypot(dx,dy)>4) pointerMoved = true;
    if (pointers.size === 2 && panOrigin.distance) {
      const [a,b] = [...pointers.values()];
      setZoom(panOrigin.zoom*Math.hypot(a.x-b.x,a.y-b.y)/panOrigin.distance);
    } else if (zoom > 1) {
      panX = panOrigin.panX+dx; panY = panOrigin.panY+dy; renderZoom();
    }
  });
  const endPan = e => { pointers.delete(e.pointerId); panOrigin = null; };
  stage.addEventListener('pointerup', endPan);
  stage.addEventListener('pointercancel', endPan);
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); moveLightbox(e.key === 'ArrowRight' ? 1 : -1); }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(zoom+.5); }
    if (e.key === '-') { e.preventDefault(); setZoom(zoom-.5); }
  });
  addEventListener('resize', renderZoom);
  const makeGallery = (root, sources, mode) => {
    if (!root) return;
    root.innerHTML = `<div class="standalone-gallery standalone-gallery--${mode}" role="region" aria-label="Artwork gallery" tabindex="0"><div class="standalone-gallery__viewport"><div class="standalone-gallery__track">${sources.map(([src,alt])=>`<div class="standalone-gallery__slide" role="button" tabindex="0" aria-label="Open ${alt}"><img src="${src}" alt="${alt}" loading="${(mode === 'mobile') === (innerWidth <= 750) ? 'eager' : 'lazy'}" decoding="async" draggable="false"></div>`).join('')}</div></div><button type="button" class="standalone-gallery__nav standalone-gallery__prev" aria-label="Previous image">${chevron('prev')}</button><button type="button" class="standalone-gallery__nav standalone-gallery__next" aria-label="Next image">${chevron('next')}</button></div>`;
    const gallery = $('.standalone-gallery', root);
    const viewport = $('.standalone-gallery__viewport', root);
    const track = $('.standalone-gallery__track', root);
    const slides = $$('.standalone-gallery__slide', root);
    const prev = $('.standalone-gallery__prev', root);
    const next = $('.standalone-gallery__next', root);
    let index = 0, startX = 0, deltaX = 0, pointerId = null, dragged = false, pressedSlide = null;
    const step = () => slides[1]?.offsetLeft - slides[0]?.offsetLeft || slides[0]?.offsetWidth || 1;
    const maxIndex = () => mode === 'desktop' ? Math.max(0, slides.length - 3) : slides.length - 1;
    const render = (drag = 0) => {
      const distance = step();
      const offset = Math.max(-maxIndex() * distance, Math.min(0, -index * distance + drag));
      track.style.transform = `translate3d(${offset}px,0,0)`;
      prev.disabled = index === 0;
      next.disabled = index === maxIndex();
    };
    const go = direction => { index = Math.max(0, Math.min(maxIndex(), index + direction)); render(); };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); }
    });
    slides.forEach(slide => slide.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); slide.click(); }
    }));
    viewport.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; deltaX = 0; dragged = false;
      pressedSlide = e.target.closest('.standalone-gallery__slide');
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
    viewport.addEventListener('click', e => {
      const slide = e.target.closest('.standalone-gallery__slide') || pressedSlide;
      if (!slide || dragged) { dragged = false; return; }
      lightboxSources = sources;
      lightboxIndex = slides.indexOf(slide);
      showLightboxImage();
      returnFocus = slide;
      lightbox.showModal();
      document.documentElement.classList.add('lightbox-open');
      renderZoom();
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
        // Match Wix's three tracks, including the additive clip rotation.
        const depth = (parseFloat(getComputedStyle(element).getPropertyValue('--motion-height')) || 200) / 2;
        const baseRotation = getComputedStyle(element).getPropertyValue('--comp-rotate-z') || '0deg';
        const epsilon = .000001;
        return {target:element, tracks:[
          {frames:[{opacity:0},{opacity:1}], duration:(effect.duration ?? 1200)*.2, easing:'cubic-bezier(.215,.61,.355,1)'},
          {frames:[
            {offset:0,transform:'perspective(800px)',easing:'step-end'},
            {offset:epsilon,transform:`perspective(800px) translateZ(-${depth}px) rotateX(-90deg) translateZ(${depth}px) rotate(${baseRotation})`},
            {transform:`perspective(800px) translateZ(-${depth}px) rotateX(0deg) translateZ(${depth}px) rotate(${baseRotation})`}
          ], duration:effect.duration ?? 1200, easing:'cubic-bezier(.215,.61,.355,1)'},
          {frames:[
            {offset:epsilon,clipPath:'polygon(0% 0%,100% 0%,100% 0%,0% 0%)',transform:`rotateZ(${n.direction === 'right' ? -30 : 30}deg)`},
            {clipPath:'polygon(0% 0%,100% 0%,100% 100%,0% 100%)',transform:'rotateZ(0deg)'}
          ], composite:'add', duration:(effect.duration ?? 1200)*.8, easing:'cubic-bezier(.215,.61,.355,1)'}
        ]};
      }
      case 'FadeScroll': return {target:element, tracks:[{frames:[{opacity:out ? 1 : (n.opacity ?? 0)}, {opacity:out ? (n.opacity ?? 0) : 1}]}]};
      case 'ShrinkScroll': return {target:element, tracks:[{frames:[{transform:`scale(${n.scale ?? 1.2})`}, {transform:'scale(1)'}], easing:innerWidth <= 1000 ? 'linear' : 'cubic-bezier(.47,0,.745,.715)'}]};
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
        const base = innerWidth <= 1000 ? getComputedStyle(element).transform : 'none';
        const resting = base === 'none' ? '' : ` ${base}`;
        return {target:element, tracks:[{frames:[{transform:(out ? 'translate(0,0)' : moved)+resting}, {transform:(out ? moved : 'translate(0,0)')+resting}]}]};
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
  const examinationStacks = [
    {section:document.getElementById('comp-lxu99cll'), ids:['comp-mpttwj7v','comp-mpttzafl','comp-mpttytua']},
    {section:document.getElementById('comp-mpuix9j9'), ids:['comp-mpuj4f1g','comp-mpuj4f1i10','comp-mpuj4f1j19']}
  ];
  const examinationImageIds = new Set(examinationStacks.flatMap(stack => stack.ids));
  examinationStacks.forEach(stack => {
    stack.images = stack.ids.map(id => document.getElementById(id));
    stack.images.forEach((image,index) => { if (image) image.style.zIndex = String(53-index); });
  });
  let scrubs = [], timed = [], observer;
  const played = new Set();
  const layoutTop = element => {
    let y = 0;
    for (let node = element; node; node = node.offsetParent) y += node.offsetTop || 0;
    return y;
  };
  const flowRange = element => {
    const chain = [];
    let flow = 0;
    for (let node = element; node; node = node.offsetParent) {
      const style = getComputedStyle(node);
      const sticky = style.position === 'sticky';
      const pin = sticky ? parseFloat(style.top) : NaN;
      const previous = node.style.position;
      if (sticky) node.style.position = 'static';
      const offset = node.offsetTop || 0;
      node.style.position = previous;
      flow += offset;
      chain.unshift({node, offset, pin});
    }
    let start = flow - innerHeight, end = flow + element.offsetHeight, position = 0;
    chain.forEach((item, index) => {
      position += item.offset;
      if (!Number.isFinite(item.pin) || !index) return;
      const pinStart = position - item.pin;
      if (pinStart > end) return;
      const travel = Math.max(0, chain[index - 1].node.offsetHeight - item.offset - item.node.offsetHeight);
      if (pinStart < start) start += travel;
      end += travel;
      position += travel;
    });
    return {start, end};
  };
  const artworkSideImageIds = new Set(['comp-mpuj9y3o', 'comp-mpuj9y3q9', 'comp-mpuaw403', 'comp-mpuaw6up']);
  const tabletStory = document.getElementById('comp-ly5n05rw');
  const artworkSection = document.getElementById('comp-lxun76he');
  const updateMotion = () => {
    // Bound the tablet story overlay before the artwork and expert sections.
    if (tabletStory && artworkSection) {
      tabletStory.style.visibility = innerWidth > 750 && innerWidth <= 1000 && scrollY >= layoutTop(artworkSection) ? 'hidden' : '';
    }
    for (const {section,images} of examinationStacks) {
      if (!section || !section.offsetHeight) continue;
      const progress = reducedMotion.matches ? 0 : clamp((scrollY-layoutTop(section))/section.offsetHeight);
      images.forEach((image,index) => {
        if (image) image.style.opacity = String(innerWidth <= 750 || index === 2 ? 1 : 1-clamp(progress*3-index));
      });
    }
    for (const {source, effect, animations, progressSource, viewRange} of scrubs) {
      const geometry = progressSource || source;
      const cover = viewRange ? (scrollY - viewRange.start) / (viewRange.end - viewRange.start) : (scrollY + innerHeight - layoutTop(geometry)) / (innerHeight + geometry.offsetHeight);
      const start = (effect.startOffset?.offset?.value ?? 0) / 100;
      const end = (effect.endOffset?.offset?.value ?? 100) / 100;
      // Give the two side images more scroll distance on mobile and tablet.
      const scrollSpan = innerWidth <= 1000 && artworkSideImageIds.has(source.id) ? 1.5 : 1;
      const currentTime = clamp((cover - start) / ((end - start || 1) * scrollSpan)) * 1000;
      animations.forEach(animation => { animation.currentTime = currentTime; });
    }
  };
  const configureMotion = () => {
    observer?.disconnect();
    document.documentElement.classList.add("motion-initialized");
    $$("[data-entrance-pending]").forEach(element => element.removeAttribute("data-entrance-pending"));
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
    }, {rootMargin:innerWidth <= 1000 ? '0px' : '0px 0px -5% 0px', threshold:innerWidth <= 1000 ? 0 : 0.01});
    const seen = new Set();
    for (const [sourceId, events] of Object.entries(motion.triggers)) {
      const source = document.getElementById(sourceId);
      if (!source) continue;
      for (const [event, targets] of Object.entries(events)) {
        if (event !== 'view-progress' && event !== 'viewport-enter') continue;
        for (const [targetId, groups] of Object.entries(targets)) {
          const element = document.getElementById(targetId);
          if (!element || examinationImageIds.has(targetId)) continue;
          for (const group of groups) {
            if (!inRange(group.triggerBpRange)) continue;
            for (const reaction of group.reactions || []) {
              const effectId = reaction.reactionData?.effect;
              const key = `${event}:${sourceId}:${targetId}:${effectId}`;
              if (seen.has(key)) continue;
              seen.add(key);
              const effect = pickEffect(motion.effects[targetId]?.[effectId]);
              if (!effect?.namedEffect) continue;
              let definition = keyframesFor(effect, element);
              if (!definition) continue;
              const createAnimations = () => definition.tracks.map(track => {
                const animation = definition.target.animate(track.frames, {
                  duration:event === 'view-progress' ? 1000 : (track.duration ?? effect.duration ?? 1200),
                  delay:event === 'view-progress' ? 0 : (effect.delay ?? 0) + (innerWidth <= 1000 ? 1 : 0),
                  easing:track.easing ?? 'linear',
                  composite:track.composite ?? 'replace',
                  fill:event === 'view-progress' ? 'both' : 'backwards'
                });
                if (event === 'view-progress') animation.pause();
                else animation.onfinish = () => animation.cancel();
                return animation;
              });
              if (event === 'view-progress') {
                const viewRange = innerWidth <= 1000 ? flowRange(source) : undefined;
                scrubs.push({source, effect, animations:createAnimations(), viewRange,
                  progressSource:innerWidth > 1000 && getComputedStyle(source).position === 'sticky' ? source.closest('.wixui-section') : null});
              }
              else if (!played.has(key)) {
                element.setAttribute("data-entrance-pending", "");
                // Observe the resting geometry before TiltIn clips and rotates it.
                // Creating a paused entrance first can prevent intersection forever.
                const item = {source, animations:[], key, start() {
                  if (!this.animations.length) {
                    definition = keyframesFor(effect, element);
                    this.animations = createAnimations();
                    element.removeAttribute("data-entrance-pending");
                  }
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
    else {
      if (innerWidth <= 1000) scrubs.forEach(item => { item.viewRange = flowRange(item.source); });
      updateMotion();
    }
  });
  reducedMotion.addEventListener('change', configureMotion);
  (document.fonts?.ready ?? Promise.resolve()).then(configureMotion);
  if (window.Lenis && !reducedMotion.matches) {
    const lenis = new window.Lenis({lerp:.27, wheelMultiplier:.9});
    const frame = time => { lenis.raf(time); requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
    const protectEmbeddedScroll = () => {
      $$('iframe, [id*="chat"], [class*="chat"], .standalone-lightbox').forEach(element => {
        if (element.hasAttribute('data-lenis-prevent')) return;
        element.setAttribute('data-lenis-prevent','');
        element.addEventListener('wheel', event => event.stopPropagation(), {passive:false});
      });
    };
    protectEmbeddedScroll();
    setInterval(protectEmbeddedScroll,1000);
  }
  const marquee = $('.wixui-text-marquee .mwhagG');
  const toggle = $('.wixui-text-marquee [aria-label="Play Marquee"]');
  if (marquee && toggle && !reducedMotion.matches) {
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      const copies = [...marquee.children];
      const speed = innerWidth <= 750 ? 22 : 28;
      const animations = copies.map(copy => {
        const animation = copy.animate([{transform:'translateX(0)'},{transform:'translateX(-100%)'}],
          {duration:copy.scrollWidth / speed * 1000,iterations:Infinity,easing:'linear'});
        animation.pause();
        return animation;
      });
      let playing = true, entered = false;
      const refresh = () => {
        toggle.setAttribute('aria-label',playing ? 'Pause Marquee' : 'Play Marquee');
        toggle.setAttribute('aria-pressed',String(playing));
        animations.forEach(animation => playing && entered ? animation.play() : animation.pause());
      };
      const entrance = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        entered = true;
        refresh();
        const root = marquee.closest('.wixui-text-marquee');
        root.animate([{transform:'translateY(32px)',opacity:0},{transform:'translateY(0)',opacity:1}],
          {duration:900,easing:'cubic-bezier(.22,1,.36,1)'});
        let started;
        const settle = time => {
          started ??= time;
          const progress = Math.min(1,(time-started)/1100);
          const rate = 1 + .7*(1-progress*progress*(3-2*progress));
          animations.forEach(animation => animation.playbackRate = rate);
          if (progress < 1) requestAnimationFrame(settle);
        };
        requestAnimationFrame(settle);
        entrance.disconnect();
      },{threshold:0});
      entrance.observe(marquee);
      toggle.addEventListener('click',() => {playing = !playing;refresh();});
      addEventListener('resize',() => animations.forEach((animation,index) => {
        const phase = (animation.currentTime ?? 0) / animation.effect.getTiming().duration;
        const duration = copies[index].scrollWidth / (innerWidth <= 750 ? 22 : 28)*1000;
        animation.effect.updateTiming({duration});
        animation.currentTime = phase*duration;
      }));
      refresh();
    });
  }
})();
