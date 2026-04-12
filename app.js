/* ═══════════════════════════════════════════════
   JOSHLEE SOLUTIONS AFRICA — app.js
   ═══════════════════════════════════════════════ */

/* ─── DEFAULT DATA ─── */
const DEFAULT_DATA = {
  hero: {
    tag: "IT Consultancy · Nairobi, Kenya",
    headline: "Developing",
    headlineItalic: "Solutions",
    headlineSmall: "for The Future",
    description: "Joshlee Solutions Africa provides world-class IT consultancy, cybersecurity, networking, cloud, and software services — empowering businesses across East Africa and beyond with innovative, cost-effective technology."
  },
  about: {
    label: "Who We Are",
    heading: "Your Trusted IT Partner in East Africa",
    body: "Joshlee Solutions Africa is an Information Technology consultancy dedicated to developing solutions that transform how businesses operate. We assist companies in making the best ICT decisions — from strategy and infrastructure to cybersecurity and digital transformation."
  },
  services: {
    label: "What We Do",
    heading: "Our Core Services",
    description: "From ICT management and cybersecurity to networking and digital marketing — we provide end-to-end technology solutions tailored to your business needs.",
    items: [
      {ic:'🎯',n:'01',t:'ICT Management',d:'We assist companies decide on the best ICT policies and strategies that will add value and ensure ICT standards are current.',tags:['Strategy','Policy','Planning','Governance']},
      {ic:'🔐',n:'02',t:'Cybersecurity',d:'Comprehensive cybersecurity services including cloud security, network security audits and software security assessments.',tags:['Cloud Security','Network Security','Software Audit','Threat Analysis']},
      {ic:'☁️',n:'03',t:'Cloud Solutions',d:'We offer cloud solutions that ensure all client storage needs are met and that their data is secure, accessible and scalable.',tags:['Cloud Storage','Migration','Backup','Office 365']},
      {ic:'🌐',n:'04',t:'Networking Services',d:'Over 7 years experience delivering networking solutions with minimal downtime — LAN, WAN and bandwidth advisory.',tags:['LAN/WAN','Bandwidth','Infrastructure','Monitoring']},
      {ic:'💻',n:'05',t:'Website Development & SEO',d:'We develop websites that are intuitive, informative and interactive — an excellent way to exude confidence to your clients.',tags:['Web Design','SEO','CMS','E-commerce']},
      {ic:'📈',n:'06',t:'Digital Marketing & IT Audit',d:'We expose clients to existing and new audiences digitally, while offering Network Security, System and Overall ICT Audits.',tags:['Digital Marketing','IT Audit','Network Audit','System Review']},
      {ic:'🖥️',n:'07',t:'Hardware & Software Procurement',d:'We advise on the best hardware and software to procure with the best specifications and at a good market rate.',tags:['Hardware','Software','Licensing','Value Analysis']},
      {ic:'🔑',n:'08',t:'IT Turnkey Solutions',d:'End-to-end IT project delivery — from planning and procurement through installation, configuration and handover.',tags:['Full Delivery','Setup','Configuration','Handover']},
    ]
  },
  products: {
    label: "IT Solutions",
    heading: "Specialised Offerings",
    description: "Targeted solutions designed to address specific technology challenges — security, infrastructure, compliance, and digital presence.",
    items: [
      {ic:'🛡️',n:'01',t:'Cyber Security Suite',d:'A complete cybersecurity package protecting your business from evolving digital threats.',f:['Penetration Testing','Vulnerability Assessment','Incident Response','Security Training','Compliance Reporting']},
      {ic:'☁️',n:'02',t:'Cloud Security',d:'Secure your cloud infrastructure with monitoring, access control and encryption solutions.',f:['Access Management','Data Encryption','Cloud Monitoring','Compliance','Disaster Recovery']},
      {ic:'🔍',n:'03',t:'Network Security Audit',d:'Comprehensive assessment of your network infrastructure to identify vulnerabilities and risks.',f:['Network Scanning','Risk Assessment','Firewall Review','VPN Audit','Audit Report']},
      {ic:'📋',n:'04',t:'Software Security Audit',d:'In-depth review of your software systems to ensure they meet security and compliance standards.',f:['Code Review','OWASP Compliance','Security Testing','Patch Management','Remediation Plan']},
      {ic:'🔧',n:'05',t:'IT Turnkey Solutions',d:'Complete, ready-to-use IT infrastructure solutions delivered from start to finish.',f:['Needs Analysis','Procurement','Installation','Configuration','Ongoing Support']},
      {ic:'📊',n:'06',t:'ICT Strategy & Advisory',d:'Expert guidance on technology investments, digital transformation and IT governance.',f:['IT Roadmap','Technology Review','Budget Advisory','Vendor Management','Policy Development']},
    ]
  },
  clients: {
    label: "Trusted By",
    heading: "Clients Who Count on Us",
    items: [
      {n:'Italian Trade Agency',l:'International',t:'Government'},
      {n:'Grasi San Marco Project',l:'Malindi, Kenya',t:'Development'},
      {n:'Self Help Africa',l:'Kenya',t:'NGO'},
      {n:'Metropolitan Sacco Limited',l:'Nairobi, Kenya',t:'Financial'},
    ]
  },
  testimonials: {
    label: "Testimonials",
    heading: "What Our Clients Say",
    items: [
      {q:'Joshlee Solutions Africa delivered an exceptional network security audit that gave us complete confidence in our IT infrastructure. Professional, thorough and highly knowledgeable.',n:'Client Representative',r:'Italian Trade Agency',i:'IT'},
      {q:'The team provided outstanding IT support for our project in Malindi. Their expertise in networking and cloud solutions made our operations seamless from day one.',n:'Project Manager',r:'Grasi San Marco Project, Malindi',i:'GS'},
      {q:'We rely on Joshlee Solutions Africa for all our ICT needs. Their response time, quality of service and honest advice sets them apart from anyone else we have worked with.',n:'IT Coordinator',r:'Self Help Africa, Kenya',i:'SH'},
    ]
  },
  contact: {
    label: "Contact Us",
    heading: "Let's Start a Conversation",
    description: "Whether you need an IT audit, cybersecurity consultation, network setup or a new website — our team is ready to help.",
    phone: "0739 293 691",
    email: "info@joshleesafrica.com",
    website: "joshleesafrica.com",
    location: "Nairobi, Kenya"
  },
  pullquote: {
    text: "We design solutions and products that are easy to understand, easy to use, and dependable — built to meet the changing demands of modern business.",
    attr: "— Joshlee Solutions Africa · Nairobi, Kenya"
  },
  theme: {
    purple: "#4B1D8F",
    purple2: "#6B32C8",
    gold: "#C9960C",
    gold2: "#E4AF24",
    black: "#0A0812",
    white: "#FEFCFF",
    cream: "#F9F6FF",
    ink: "#0D0A1A"
  },
  zoomSteps: [
    {n:'I',t:'Assess Your',em:'IT Landscape',d:'We begin with a thorough understanding of your current technology infrastructure, identifying gaps and opportunities.'},
    {n:'II',t:'Secure Every',em:'Entry Point',d:'From network perimeters to cloud environments — we implement layered cybersecurity that keeps threats out.'},
    {n:'III',t:'Build',em:'Resilient Systems',d:'We design and deploy reliable IT infrastructure that performs under pressure and scales with your business.'},
    {n:'IV',t:'Empower Your',em:'Digital Presence',d:'Professional websites, SEO and digital marketing strategies that connect you with the clients you deserve.'},
    {n:'V',t:'Deliver',em:'Turnkey Solutions',d:'From first conversation to final handover — we manage the entire technology journey so you can focus on your business.'},
  ],
  techCards:[{ic:'🪟',t:'Office 365',d:'Productivity'},{ic:'☁️',t:'Azure/AWS',d:'Cloud'},{ic:'🐧',t:'Linux',d:'Server OS'},{ic:'🛡️',t:'Fortinet',d:'Security'},{ic:'🔗',t:'Cisco',d:'Networking'},{ic:'📊',t:'Analytics',d:'Reporting'},{ic:'🌐',t:'Web Platforms',d:'Development'},{ic:'🔒',t:'Encryption',d:'Data Security'}],
  techPts:[
    {n:'I',h:'Microsoft Ecosystem',p:'Office 365, Azure and Microsoft business solutions — implemented and managed by certified experts.'},
    {n:'II',h:'Enterprise Networking',p:'Cisco and industry-standard networking infrastructure for reliable, high-performance connectivity.'},
    {n:'III',h:'Security-First Approach',p:'Every solution we build incorporates security by design — not as an afterthought.'},
  ],
  values:[
    {ic:'✅',h:'Acceptability',p:'We design solutions and products that are easy to understand, easy to use and compatible with existing operations and infrastructure.'},
    {ic:'🤝',h:'Dependability',p:'Our products can be trusted and relied on to deliver on client expectations and business demands — every time.'},
    {ic:'⚡',h:'Efficiency',p:'Products developed are affordable and provide cost-effective ways to maximize system resources and reduce wastage.'},
    {ic:'🔄',h:'Maintainability',p:'Our products are flexible and adapt to meet changing business demands and challenges as your organisation grows.'},
  ],
  stats:[{n:7,l:'Years Experience',s:'+'},{n:8,l:'Core Services',s:''},{n:3,l:'Major Clients',s:'+'},{n:99,l:'% Commitment',s:'%'}],
  aboutPts:[
    {ic:'🔐',h:'Cybersecurity First',p:'We put security at the heart of every solution we deliver — protecting your data and systems from evolving threats.'},
    {ic:'🤝',h:'Partnership Approach',p:'We act as your dedicated IT partner — not just a vendor — invested in your long-term success and growth.'},
    {ic:'💡',h:'Cost-Effective Innovation',p:'We leverage open-source and proven technologies to deliver maximum value without unnecessary expense.'},
  ],
  heroMinis:[{ic:'🔐',t:'Cybersecurity'},{ic:'☁️',t:'Cloud'},{ic:'🌐',t:'Networking'},{ic:'💻',t:'Web & SEO'}],
  rotItems:[{ic:'🪟',nm:'Microsoft 365'},{ic:'☁️',nm:'Azure Cloud'},{ic:'🔗',nm:'Cisco Systems'},{ic:'🛡️',nm:'Fortinet Security'},{ic:'🐧',nm:'Linux Server'},{ic:'📊',nm:'Google Analytics'},{ic:'🌐',nm:'WordPress'},{ic:'🔒',nm:'SSL Security'}],
  ticker:['ICT Management','Cybersecurity','Cloud Solutions','Networking Services','Website Development','SEO','Digital Marketing','IT Audit','Hardware Procurement','IT Turnkey Solutions','Network Security Audit','Software Security Audit','Cloud Security'],
};

/* ─── DATA STATE ─── */
let D = JSON.parse(JSON.stringify(DEFAULT_DATA));

/* ─── HELPERS ─── */
const g = id => document.getElementById(id);
const s = (id, html) => { const e = g(id); if (e) e.innerHTML = html; };

/* ─── LOAD DATA FROM SERVER ─── */
async function loadData() {
  try {
    const res = await fetch('/api/content');
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length) {
        D = deepMerge(DEFAULT_DATA, data);
      }
    }
  } catch(e) {
    console.log('Using default data');
  }
}

function deepMerge(base, override) {
  const result = JSON.parse(JSON.stringify(base));
  for (const key in override) {
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key]) && !Array.isArray(base[key])) {
      result[key] = deepMerge(base[key] || {}, override[key]);
    } else if (override[key] !== undefined && override[key] !== null && override[key] !== '') {
      result[key] = override[key];
    }
  }
  return result;
}

/* ─── RENDER ─── */
function renderAll() {
  console.log("Logo URL from server:", D.nav?.logoImg || "No logo");

  // FIXED LOGO RENDERING
  const nav = D.nav || {};
  const logoName = nav.logoName || 'Joshlee Solutions Africa';
  const logoTagline = nav.logoTagline || 'Developing Solutions for The Future';
  const logoImg = nav.logoImg || '';

  ['nav-logo-name','ft-logo-name'].forEach(id => { const el=g(id); if(el) el.textContent = logoName; });
  ['nav-logo-sub','ft-logo-sub'].forEach(id => { const el=g(id); if(el) el.textContent = logoTagline; });

  ['nav-logo-icon','ft-logo-icon'].forEach(id => {
    const el = g(id); if(!el) return;
    if(logoImg) {
      el.innerHTML = `<img src="${logoImg}" alt="${logoName}" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">`;
      el.classList.add('has-img');
    } else {
      el.innerHTML = '';
      el.classList.remove('has-img');
    }
  });

  // Hero
  const htEl = g('hero-tag'); if(htEl) htEl.textContent = D.hero.tag;
  const h1El = g('hero-h1');
  if(h1El) {
    const firstNode = h1El.firstChild;
    if(firstNode && firstNode.nodeType === 3) firstNode.nodeValue = D.hero.headline + '\n        ';
  }
  const emEl = g('hero-h1-em'); if(emEl) emEl.textContent = D.hero.headlineItalic;
  const smEl = g('hero-h1-small'); if(smEl) smEl.textContent = D.hero.headlineSmall;
  const descEl = g('hero-desc'); if(descEl) descEl.textContent = D.hero.description;

  // Particles
  const pc = g('hero-particles');
  if (pc && !pc.dataset.built) {
    pc.dataset.built = '1';
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hp';
      p.style.cssText = `left:${Math.random()*100}%;width:${1+Math.random()*3}px;height:${1+Math.random()*3}px;animation-duration:${10+Math.random()*15}s;animation-delay:${Math.random()*12}s;`;
      pc.appendChild(p);
    }
  }

  s('hero-minis', D.heroMinis.map(m => `<div class="hsm"><div class="hsm-ic">${m.ic}</div><div class="hsm-t">${m.t}</div></div>`).join(''));
  s('ticker', [...D.ticker,...D.ticker].map(t => `<div class="t-item"><span class="gem">◆</span>${t}</div>`).join(''));

  // About
  const alEl = g('about-lbl'); if(alEl) alEl.textContent = D.about.label;
  const ahEl = g('about-h'); if(ahEl) ahEl.innerHTML = D.about.heading.replace(/IT/,'<em>IT</em>');
  const apEl = g('about-p'); if(apEl) apEl.textContent = D.about.body;
  s('about-pts', D.aboutPts.map((p,i) => `<div class="a-pt rv d${i+1}"><div class="a-pt-ic">${p.ic}</div><div><div class="a-pt-h">${p.h}</div><div class="a-pt-p">${p.p}</div></div></div>`).join(''));

  // Services
  const slEl = g('svc-lbl'); if(slEl) slEl.textContent = D.services.label;
  const shEl = g('svc-h'); if(shEl) shEl.innerHTML = `Our <em>${(D.services.heading || 'Core Services').replace(/^Our\s+/i,'')}</em>`;
  const spEl = g('svc-p'); if(spEl) spEl.textContent = D.services.description;
  s('services-grid', D.services.items.map((sv,i) => `<div class="svc-card rv d${Math.min(i+1,5)}"><div class="svc-num">${sv.n || String(i+1).padStart(2,'0')}</div><div class="svc-ic">${sv.ic}</div><div class="svc-title">${sv.t}</div><div class="svc-desc">${sv.d}</div><div class="svc-tags">${(sv.tags||[]).map(t=>`<span class="svc-tag">${t}</span>`).join('')}</div></div>`).join(''));

  // Products
  const plEl = g('prod-lbl'); if(plEl) plEl.textContent = D.products.label;
  const phEl = g('prod-h'); if(phEl) phEl.innerHTML = `Specialised <em>${(D.products.heading || 'Specialised Offerings').replace(/^Specialised\s+/i,'')}</em>`;
  const ppEl = g('prod-p'); if(ppEl) ppEl.textContent = D.products.description;
  s('prod-track', D.products.items.map((p,i) => `<div class="prod-card"><div class="prod-card-top"><div class="pc-num">${p.n || String(i+1).padStart(2,'0')}</div><div class="prod-card-ic">${p.ic}</div><div class="prod-card-title">${p.t}</div><div class="prod-card-desc">${p.d}</div></div><ul class="prod-card-feats">${(p.f||[]).map(f=>`<li>${f}</li>`).join('')}</ul></div>`).join(''));
  initProdScroll();

  // Clients
  const cllEl = g('cl-lbl'); if(cllEl) cllEl.textContent = D.clients.label;
  const clhEl = g('cl-h'); if(clhEl) clhEl.innerHTML = D.clients.heading.replace('Count on Us','<em>Count on Us</em>');
  const mkCl = arr => arr.map(c => `<div class="cl-card"><div class="cl-name">${c.n}</div><div class="cl-loc">${c.l}</div><div class="cl-badge">${c.t}</div></div>`).join('');
  s('cl-track', mkCl([...D.clients.items,...D.clients.items,...D.clients.items]));
  s('cl-track2', mkCl([...[...D.clients.items].reverse(),...[...D.clients.items].reverse(),...[...D.clients.items].reverse()]));
  startCl();

  // Zoom steps
  s('zoom-steps', D.zoomSteps.map((z,i) => `<div class="z-step ${i===0?'on':''}" id="zs${i}"><span class="z-step-tag">Chapter ${z.n}</span><h2 class="z-step-h">${z.t} <em>${z.em}</em></h2><p class="z-step-p">${z.d}</p></div>`).join(''));
  s('z-prog', D.zoomSteps.map((_,i) => `<div class="z-dot ${i===0?'on':''}" id="zd${i}"></div>`).join(''));
  s('z-side', D.zoomSteps.map((z,i) => `<div class="z-si ${i===0?'on':''}" id="zsi${i}"><div class="z-si-bar"></div><div class="z-si-lbl">${z.t} ${z.em}</div></div>`).join(''));
  s('chap-cards-mobile', D.zoomSteps.map((z,i) => `<div class="chap-card rv d${Math.min(i+1,5)}"><span class="chap-num">${z.n}</span><span class="chap-tag">Chapter ${z.n}</span><div class="chap-h">${z.t} <em>${z.em}</em></div><p class="chap-p">${z.d}</p></div>`).join(''));

  // Pullquote
  const pqEl = g('pq-text'); if(pqEl) pqEl.innerHTML = D.pullquote.text.replace('easy to understand, easy to use,','<em>easy to understand, easy to use,</em>');
  const pqaEl = g('pq-attr'); if(pqaEl) pqaEl.textContent = D.pullquote.attr;

  // Tech
  const techLblEl = g('tech-lbl'); if(techLblEl) techLblEl.textContent = 'Technology Stack';
  const stage = g('tech-stage');
  if (stage) stage.innerHTML = `<div class="sp-grid">${D.techCards.map(c=>`<div class="sp-c"><div class="ic">${c.ic}</div><div class="t">${c.t}</div><div class="d">${c.d}</div></div>`).join('')}</div>`;
  s('tech-pts', D.techPts.map(p=>`<div class="tech-pt rv"><div class="tp-n">${p.n}</div><div><div class="tp-h">${p.h}</div><div class="tp-p">${p.p}</div></div></div>`).join(''));

  // Stats
  s('stats-row', D.stats.map(st=>`<div class="stat-col" data-l="${st.l}"><div class="stat-n" data-count="${st.n}" data-suf="${st.s}">0</div><div class="stat-l">${st.l}</div></div>`).join(''));

  // Values
  s('values-grid', D.values.map((v,i)=>`<div class="val-card rv d${i+1}"><div class="val-ic">${v.ic}</div><div class="val-h">${v.h}</div><div class="val-p">${v.p}</div></div>`).join(''));

  // Rotation
  s('rot-track', [...D.rotItems,...D.rotItems,...D.rotItems].map(r=>`<div class="rot-c"><div class="ic">${r.ic}</div><div class="nm">${r.nm}</div></div>`).join(''));
  startRot();

  // Testimonials
  const tlEl = g('test-lbl'); if(tlEl) tlEl.textContent = D.testimonials.label;
  const thEl = g('test-h'); if(thEl) thEl.innerHTML = D.testimonials.heading.replace('Clients','<em>Clients</em>');
  s('test-cards', D.testimonials.items.map((t,i)=>`<div class="test-card rv d${i+1}"><div class="test-stars">★★★★★</div><div class="test-q">"${t.q}"</div><div class="test-author"><div class="test-av">${t.i}</div><div><div class="test-nm">${t.n}</div><div class="test-rl">${t.r}</div></div></div></div>`).join(''));

  // Contact
  const ctlEl = g('ct-lbl'); if(ctlEl) ctlEl.textContent = D.contact.label;
  const cthEl = g('ct-h'); if(cthEl) cthEl.innerHTML = `Let's Start a <em>Conversation</em>`;
  const ctpEl = g('ct-p'); if(ctpEl) ctpEl.textContent = D.contact.description;
  const ciVals = document.querySelectorAll('.ci-val');
  if(ciVals[0]) ciVals[0].textContent = D.contact.phone;
  if(ciVals[1]) ciVals[1].textContent = D.contact.email;
  if(ciVals[2]) ciVals[2].textContent = D.contact.website;
  if(ciVals[3]) ciVals[3].textContent = D.contact.location;

  reObserve();
  observeCounters();
}

/* ─── THEME ─── */
function applyTheme() {
  const r = document.documentElement;
  const t = D.theme;
  if(!t) return;
  if(t.purple) r.style.setProperty('--purple', t.purple);
  if(t.purple2) r.style.setProperty('--purple2', t.purple2);
  if(t.gold) r.style.setProperty('--gold', t.gold);
  if(t.gold2) r.style.setProperty('--gold2', t.gold2);
  if(t.black) r.style.setProperty('--black', t.black);
  if(t.white) r.style.setProperty('--white', t.white);
  if(t.cream) r.style.setProperty('--cream', t.cream);
  if(t.ink) r.style.setProperty('--ink', t.ink);
}

/* ─── PRODUCT SCROLL ─── */
function initProdScroll() {
  const track = g('prod-track'), thumb = g('prod-thumb');
  if (!track || !thumb) return;
  const cw = 320;
  function upThumb() {
    const mx = track.scrollWidth - track.clientWidth;
    const p = mx > 0 ? track.scrollLeft / mx : 0;
    const tw = Math.max(10, 100*(track.clientWidth/track.scrollWidth));
    thumb.style.width = tw + '%';
    thumb.style.left = (p*(100-tw)) + '%';
  }
  track.removeEventListener('scroll', upThumb);
  track.addEventListener('scroll', upThumb, {passive:true});
  const prevBtn = g('prod-prev'), nextBtn = g('prod-next');
  if(prevBtn) prevBtn.onclick = () => track.scrollBy({left:-cw,behavior:'smooth'});
  if(nextBtn) nextBtn.onclick = () => track.scrollBy({left:cw,behavior:'smooth'});
  upThumb();
}

/* ─── CLIENTS MARQUEE ─── */
let clAnimId = null;
let cX = 0, cX2 = 0;
function startCl() {
  if (clAnimId) cancelAnimationFrame(clAnimId);
  const t1 = g('cl-track'), t2 = g('cl-track2');
  if (!t1 || !t2) return;
  function step() {
    const mx1 = t1.scrollWidth / 3;
    const mx2 = t2.scrollWidth / 3;
    cX += 0.5; if (cX >= mx1) cX = 0;
    cX2 += 0.5; if (cX2 >= mx2) cX2 = 0;
    t1.style.transform = `translateX(-${cX}px)`;
    t2.style.transform = `translateX(${cX2 - mx2/3*2}px)`;
    clAnimId = requestAnimationFrame(step);
  }
  step();
}

/* ─── ROTATION MARQUEE ─── */
let rotAnimId = null, rX = 0;
function startRot() {
  if (rotAnimId) cancelAnimationFrame(rotAnimId);
  const t = g('rot-track'); if (!t) return;
  function step() {
    rX += 0.5;
    const mx = t.scrollWidth / 3;
    if (rX >= mx) rX = 0;
    t.style.transform = `translateX(-${rX}px)`;
    rotAnimId = requestAnimationFrame(step);
  }
  step();
}

/* ─── ZOOM SCROLL ─── */
function initZoom() {
  const outer = g('zoom-outer'); if (!outer) return;
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 960) return;
    const rect = outer.getBoundingClientRect();
    const total = outer.offsetHeight - window.innerHeight;
    const sc = -rect.top;
    if (sc <= 0 || sc >= total) {
      const showIdx = sc <= 0 ? 0 : D.zoomSteps.length - 1;
      D.zoomSteps.forEach((_,i) => {
        [g(`zs${i}`),g(`zd${i}`),g(`zsi${i}`)].forEach(el => { if(el) el.classList.toggle('on', i===showIdx); });
      });
      return;
    }
    const prog = sc / total;
    const idx = Math.min(Math.floor(prog * D.zoomSteps.length), D.zoomSteps.length - 1);
    D.zoomSteps.forEach((_,i) => { [g(`zs${i}`),g(`zd${i}`),g(`zsi${i}`)].forEach(el => { if(el) el.classList.toggle('on', i===idx); }); });
    const r1 = g('zr1'), r2 = g('zr2'), r3 = g('zr3');
    if(r1){r1.style.transform=`scale(${0.4+prog})`;r1.style.opacity=String(0.12+prog*0.45);}
    if(r2){r2.style.transform=`scale(${0.6+prog*0.7})`;r2.style.opacity=String(0.08+prog*0.35);}
    if(r3){r3.style.transform=`scale(${0.75+prog*0.4})`;r3.style.opacity=String(0.06+prog*0.28);}
  }, {passive:true});
}

/* ─── PARALLAX CTA ─── */
function initParallax() {
  window.addEventListener('scroll', () => {
    const sec = g('cta-band'); if (!sec) return;
    const rect = sec.getBoundingClientRect();
    document.querySelectorAll('.cta-layer').forEach(l => { if(l.dataset.speed) l.style.transform = `translateY(${(-rect.top)*parseFloat(l.dataset.speed)}px)`; });
  }, {passive:true});
}

/* ─── REVEAL OBSERVER ─── */
const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);} }), {threshold:.12});
function reObserve() { document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el => { if(!el.classList.contains('in')) obs.observe(el); }); }

/* ─── COUNTER ANIMATION ─── */
function animC(el, target, suf) {
  let s = 0;
  (function f(ts) {
    if (!s) s = ts;
    const p = Math.min((ts-s)/1600, 1);
    el.textContent = Math.floor(p*target) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(0);
}
const cObs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){animC(e.target,+e.target.dataset.count,e.target.dataset.suf||'');cObs.unobserve(e.target);} }), {threshold:.5});
function observeCounters() { document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el)); }

/* ─── CURSOR ─── */
const cur = g('cur'), curR = g('cur-r');
if (cur && curR) {
  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    setTimeout(() => { curR.style.left = e.clientX + 'px'; curR.style.top = e.clientY + 'px'; }, 55);
  });
  document.addEventListener('mousedown', () => cur.style.transform = 'translate(-50%,-50%) scale(.4)');
  document.addEventListener('mouseup', () => cur.style.transform = 'translate(-50%,-50%) scale(1)');
  document.addEventListener('mouseover', e => { if(e.target.closest('a,button')){curR.style.width='48px';curR.style.height='48px';curR.style.opacity='.8';} });
  document.addEventListener('mouseout', e => { if(e.target.closest('a,button')){curR.style.width='34px';curR.style.height='34px';curR.style.opacity='.6';} });
}

/* ─── NAV ─── */
window.addEventListener('scroll', () => { g('nav').classList.toggle('scrolled', scrollY > 70); }, {passive:true});
const hbgBtn = g('hbg');
const navOverlay = g('nav-overlay');

function openMobileNav() { hbgBtn.classList.add('active'); navOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileNav() { hbgBtn.classList.remove('active'); navOverlay.classList.remove('open'); document.body.style.overflow = ''; }

if(hbgBtn) hbgBtn.addEventListener('click', () => { navOverlay.classList.contains('open') ? closeMobileNav() : openMobileNav(); });
g('nav-overlay-close')?.addEventListener('click', closeMobileNav);
navOverlay?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', e => { if(e.key==='Escape') closeMobileNav(); });

/* ─── ADMIN REDIRECT ─── */
const adminBtn = g('admin-trigger');
if(adminBtn) adminBtn.addEventListener('click', () => { window.location.href = '/admin'; });

/* ─── CONTACT FORM ─── */
async function submitContact() {
  const btn = g('cf-submit');
  const successEl = g('contact-success');
  const errorEl = g('contact-error');

  const firstName = (g('cf-fname')?.value || '').trim();
  const lastName  = (g('cf-lname')?.value || '').trim();
  const company   = (g('cf-company')?.value || '').trim();
  const email     = (g('cf-email')?.value || '').trim();
  const service   = (g('cf-service')?.value || '').trim();
  const message   = (g('cf-message')?.value || '').trim();

  if(successEl) successEl.style.display = 'none';
  if(errorEl)   errorEl.style.display   = 'none';

  if(!firstName) { showFormError('Please enter your first name.'); return; }
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFormError('Please enter a valid email address.'); return; }
  if(!message) { showFormError('Please enter a message.'); return; }

  if(btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, company, email, service, message })
    });
    const data = await res.json();
    if(data.ok) {
      if(successEl) successEl.style.display = 'block';
      ['cf-fname','cf-lname','cf-company','cf-email','cf-service','cf-message'].forEach(id => {
        const el = g(id); if(el) el.value = '';
      });
    } else {
      showFormError(data.message || 'Failed to send. Please try again.');
    }
  } catch(e) {
    showFormError('Network error. Please check your connection and try again.');
  } finally {
    if(btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  }
}

function showFormError(msg) {
  const el = g('contact-error');
  if(el) { el.textContent = msg; el.style.display = 'block'; }
}

/* ─── CHATBOT ─── */
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const win = g('chatbot-window');
  const badge = g('chatbot-badge');
  if(win) win.classList.toggle('chat-hidden', !chatOpen);
  if(badge) badge.style.display = 'none';
  if(chatOpen) {
    const inp = g('chat-input');
    if(inp) setTimeout(() => inp.focus(), 100);
  }
}

async function sendChat() {
  const inp = g('chat-input');
  if(!inp) return;
  const msg = inp.value.trim();
  if(!msg) return;

  inp.value = '';
  appendChatMsg(msg, 'user');

  const typingId = 'chat-typing-' + Date.now();
  appendChatMsg('…', 'bot', typingId);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    removeChatMsg(typingId);
    appendChatMsg(data.ok ? data.reply : "Sorry, I couldn't process that. Please try again.", 'bot');
  } catch(e) {
    removeChatMsg(typingId);
    appendChatMsg('Network error. Please check your connection.', 'bot');
  }
}

function appendChatMsg(text, role, id) {
  const box = g('chat-messages');
  if(!box) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  if(id) div.id = id;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  div.appendChild(bubble);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function removeChatMsg(id) {
  const el = g(id);
  if(el) el.remove();
}

/* ─── BOOT ─── */
(async () => {
  await loadData();
  applyTheme();
  renderAll();
  initZoom();
  initParallax();
})();