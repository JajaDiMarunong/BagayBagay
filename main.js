(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* toast */
  const toastEl = $('#toast');
  let tt;
  const toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove('show'), 2800);
  };

  /* mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* active nav link + back-to-top */
  const links = $$('#menu a[href^="#"]');
  const secs = links.map(a => $(a.getAttribute('href')));
  const totop = $('#totop');
  const onScroll = () => {
    totop.classList.toggle('show', scrollY > 600);
    const y = scrollY + 140;
    links.forEach((a, i) => a.classList.toggle('active', secs[i] && secs[i].offsetTop <= y && secs[i].offsetTop + secs[i].offsetHeight > y));
  };
  addEventListener('scroll', onScroll, { passive: true });
  totop.addEventListener('click', () => scrollTo({ top: 0 }));

  /* rotating hero word */
  const words = ['treasure', 'lifeline', 'upgrade', 'good find'];
  const swap = $('#swap');
  let w = 0;
  setInterval(() => {
    swap.classList.add('out');
    setTimeout(() => { w = (w + 1) % words.length; swap.textContent = words[w]; swap.classList.remove('out'); }, 300);
  }, 2600);

  /* hero logo tilts toward the pointer */
  const art = $('.hero-art'), logo = $('.hero-logo');
  art.addEventListener('pointermove', e => {
    const r = art.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    logo.style.transform = `rotate(${x * 10}deg) translate(${x * 10}px,${y * 10}px)`;
  });
  art.addEventListener('pointerleave', () => (logo.style.transform = ''));

  /* count-up numbers */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const end = +e.target.dataset.count, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1400, 1);
      e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + (p === 1 && end > 1000 ? '+' : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(n => io.observe(n));

  /* sample items */
  const items = [
    ['Cast-iron kawali', '🍳', 'give', 'Dasmariñas', '#FBE0BE'],
    ['Denim jacket, size M', '🧥', 'trade', 'Imus', '#DDEFD6'],
    ['Wooden study chair', '🪑', 'give', 'Bacoor', '#F1E4BF'],
    ['Pre-loved novels (6)', '📚', 'trade', 'Silang', '#DDEFD6'],
    ['Electric kettle', '🫖', 'give', 'Dasmariñas', '#FBE0BE'],
    ['Kids’ bicycle', '🚲', 'trade', 'Gen. Trias', '#F1E4BF'],
    ['Potted snake plant', '🪴', 'give', 'Carmona', '#DDEFD6'],
    ['Baby crib mattress', '🧸', 'give', 'Imus', '#FBE0BE']
  ];
  const grid = $('#grid');
  const render = f => {
    grid.innerHTML = '';
    items.filter(i => f === 'all' || i[2] === f).forEach((i, n) => {
      const c = document.createElement('article');
      c.className = 'card';
      c.style.animationDelay = n * 50 + 'ms';
      c.innerHTML = `<div class="pic" style="background:${i[4]}">${i[1]}</div>
        <div class="body"><span class="tag ${i[2]}">${i[2] === 'give' ? 'Free to take' : 'Open to trade'}</span>
        <h3>${i[0]}</h3><small>${i[3]}</small>
        <button class="btn">${i[2] === 'give' ? 'Request item' : 'Offer a trade'}</button></div>`;
      $('.btn', c).addEventListener('click', () => openModal('join', 'Sign up first to message ' + i[3] + ' neighbors!'));
      grid.append(c);
    });
  };
  render('all');
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('on', x === t));
    render(t.dataset.filter);
  }));

  /* testimonials */
  const quotes = [
    ['I gave away my old rice cooker in one afternoon. The lady who took it brought me suman!', 'Aling Cora, Dasmariñas'],
    ['Traded my kid’s outgrown school shoes for a study lamp. Everyone wins.', 'Migs, Imus'],
    ['Our barangay finally has a way to pass things on instead of burning or dumping them.', 'Kap. Lorna, Silang']
  ];
  const q = $('#quote'), dots = $('#dots');
  let qi = 0, qt;
  const showQ = i => {
    qi = i;
    q.style.opacity = 0;
    setTimeout(() => {
      $('#qtext').textContent = '“' + quotes[i][0] + '”';
      $('#qwho').textContent = quotes[i][1];
      $$('button', dots).forEach((d, n) => d.classList.toggle('on', n === i));
      q.style.opacity = 1;
    }, 250);
  };
  quotes.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Show story ' + (i + 1));
    b.addEventListener('click', () => { showQ(i); restartQ(); });
    dots.append(b);
  });
  const restartQ = () => { clearInterval(qt); qt = setInterval(() => showQ((qi + 1) % quotes.length), 6000); };
  showQ(0); restartQ();

  /* modal + form */
  const modal = $('#join'), form = $('#form'), err = $('#err');
  let lastFocus;
  function openModal(id, msg) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    err.textContent = '';
    if (msg) toast(msg);
    setTimeout(() => $('input', modal).focus(), 50);
  }
  const closeModal = () => { modal.hidden = true; lastFocus && lastFocus.focus(); };
  $$('[data-open]').forEach(b => b.addEventListener('click', () => { setMenu(false); openModal(b.dataset.open); }));
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', e => e.target === modal && closeModal());
  addEventListener('keydown', e => e.key === 'Escape' && !modal.hidden && closeModal());
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form);
    if (!d.get('name').trim()) return (err.textContent = 'Enter your name so neighbors know who you are.');
    if (!/^\S+@\S+\.\S+$/.test(d.get('email'))) return (err.textContent = 'Enter a valid email, like name@example.com.');
    closeModal(); form.reset();
    toast('You’re on the list, ' + d.get('name').trim().split(' ')[0] + '!');
  });

  /* placeholder links */
  $$('[data-toast]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(a.dataset.toast); }));

  $('#yr').textContent = new Date().getFullYear();
  onScroll();
})();
