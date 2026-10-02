(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  $('#year').textContent = new Date().getFullYear();

  const burger = $('.burger');
  const mobileNav = $('.mobile-nav');
  burger?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('.mobile-nav a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('is-open')));

  const modal = $('#contactModal');
  const form = $('#contactForm');
  const source = $('#formSource');
  const status = $('.form-status', form);
  const openModal = (src='Сайт') => { source.value = src; modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); setTimeout(()=>form.phone?.focus(),50); };
  const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); };
  $$('.js-open-form').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.source || 'Сайт')));
  $('.modal__close')?.addEventListener('click', closeModal);
  $('.modal__backdrop')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

  form?.addEventListener('submit', async e => {
    e.preventDefault(); status.className='form-status'; status.textContent='Отправляем…';
    const fd = new FormData(form);
    try {
      const res = await fetch(form.action, {method:'POST', body:fd, headers:{'Accept':'application/json'}});
      const data = await res.json();
      if(!res.ok || !data.ok) throw new Error(data.message || 'Ошибка отправки');
      status.className='form-status ok'; status.textContent='Спасибо! Заявка отправлена. Мы свяжемся с вами.'; form.reset(); source.value='Сайт';
    } catch(err) { status.className='form-status err'; status.textContent=err.message || 'Не удалось отправить заявку. Позвоните нам: +7 4942 39 00 71'; }
  });

  const track = $('#portfolioTrack');
  const prev = $('.carousel-btn--prev'), next = $('.carousel-btn--next');
  const pageLabel = $('#portfolioPage'), progress = $('#portfolioProgress');
  let page = 0;
  const visible = () => window.innerWidth <= 560 ? 1 : window.innerWidth <= 860 ? 2 : window.innerWidth <= 1180 ? 4 : 6;
  const pages = () => Math.max(1, Math.ceil(12 / visible()));
  function renderCarousel(){
    const v = visible(), gap = 12;
    const card = track.querySelector('.portfolio-card');
    if(!card) return;
    const width = card.getBoundingClientRect().width + gap;
    const max = pages()-1;
    page = Math.min(page,max);
    track.style.transform = `translateX(${-page * width * v}px)`;
    pageLabel.textContent = `${String(page+1).padStart(2,'0')} / ${String(max+1).padStart(2,'0')}`;
    progress.style.width = `${((page+1)/(max+1))*100}%`;
    prev.disabled = page===0; next.disabled = page===max;
    prev.style.opacity = page===0 ? .35 : 1; next.style.opacity = page===max ? .35 : 1;
  }
  prev?.addEventListener('click',()=>{if(page>0){page--;renderCarousel()}});
  next?.addEventListener('click',()=>{if(page<pages()-1){page++;renderCarousel()}});
  window.addEventListener('resize',()=>{page=0;renderCarousel()});
  window.addEventListener('load',renderCarousel);
  renderCarousel();

  // Portfolio lightbox: preview image in the card, separate full-size image in the viewer.
  const portfolioCards = $$('.portfolio-card');
  let viewer = null, viewerIndex = -1;
  function openPortfolioViewer(index){
    const card = portfolioCards[index];
    if(!card) return;
    viewerIndex = index;
    const full = card.dataset.full || card.getAttribute('href');
    const img = card.querySelector('img');
    if(!viewer){
      viewer = document.createElement('div');
      viewer.className='image-viewer';
      viewer.innerHTML = `<div class="image-viewer__backdrop"></div><div class="image-viewer__box"><button class="image-viewer__prev" aria-label="Предыдущий проект">‹</button><img alt=""><button class="image-viewer__next" aria-label="Следующий проект">›</button><button class="image-viewer__close" aria-label="Закрыть">×</button></div>`;
      document.body.appendChild(viewer);
      const close=()=>{ viewer.remove(); viewer=null; document.body.classList.remove('modal-open'); };
      viewer.querySelector('.image-viewer__close').onclick=close;
      viewer.querySelector('.image-viewer__backdrop').onclick=close;
      viewer.querySelector('.image-viewer__prev').onclick=()=>openPortfolioViewer((viewerIndex-1+portfolioCards.length)%portfolioCards.length);
      viewer.querySelector('.image-viewer__next').onclick=()=>openPortfolioViewer((viewerIndex+1)%portfolioCards.length);
      viewer._close=close;
      document.body.classList.add('modal-open');
    }
    const fullImg=viewer.querySelector('img');
    fullImg.src=full;
    fullImg.alt=img?.alt || '';
  }
  portfolioCards.forEach((card,i)=>card.addEventListener('click',e=>{e.preventDefault();openPortfolioViewer(i)}));
  document.addEventListener('keydown',e=>{
    if(!viewer) return;
    if(e.key==='Escape') viewer._close();
    if(e.key==='ArrowLeft') openPortfolioViewer((viewerIndex-1+portfolioCards.length)%portfolioCards.length);
    if(e.key==='ArrowRight') openPortfolioViewer((viewerIndex+1)%portfolioCards.length);
  });

})();
