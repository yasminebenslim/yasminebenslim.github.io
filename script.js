(() => {
  'use strict';

  const scrollArea = document.querySelector('.scroll-area');
  const sections = Array.from(document.querySelectorAll('.panel'));
  const hero = document.querySelector('.hero');
  const name = document.querySelector('.hero-name');
  const firstName = document.querySelector('.first-name-word');
  const remainingName = document.querySelector('.remaining-name-words');
  const leftBlock = document.querySelector('.left-text-block');
  const socialBlock = document.querySelector('.social-pills-block');
  const portraitStack = document.querySelector('.portrait-stack');
  const portraitImage = document.querySelector('.portrait-color');
  const portraitGray = document.querySelector('.portrait-grayscale');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const serviceRows = Array.from(document.querySelectorAll('.service-row'));
  const experienceRows = Array.from(document.querySelectorAll('.experience-row'));
  const contactBlock = document.querySelector('.contact-block');
  const sectionDots = Array.from(document.querySelectorAll('.section-dots span'));
  const progressBar = document.querySelector('.progress-bar');
  const desktop = window.matchMedia('(min-width: 901px)');
  const mouseDevice = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let topAlphaRatio = 0;
  let aspectRatio = 1;
  let currentIndex = 0;
  let isAnimatingScroll = false;
  let lastWheelEventAt = 0;
  let scrollAnimationFrame = 0;
  let cursorEl = null;
  let previewEl = null;
  const revealedSections = new Set();

  const standardEase = t => 1 - Math.pow(1 - t, 4);

  const translations = {
  fr: {
    documentTitle: 'Yasmine Ben Slim — Ingénieure Logicielle',
    languageLabel: 'Choisir la langue',

    availability: 'Disponible pour un nouveau projet',

    navWork: 'Projets',
    navServices: 'Services',
    navExperience: 'Expérience',
    navContact: 'Contact',

    talk: 'Parlons-en',

    jobTitle: 'Ingénieure Logicielle',
    tagline: 'Je conçois des logiciels robustes,<br>de l’IA au temps réel.',
    collaborate: 'Collaborons',

    selectedWork: '/PROJETS SÉLECTIONNÉS',

    hapticType: 'SIMULATION MÉDICALE',
    hapticTitle: 'Simulateur dentaire haptique',

    recipeType: 'NLP · DEEP LEARNING',
    recipeTitle: 'Recipe Generation Transformer',

    speechType: 'MOBILE · VISION',
    speechTitle: 'Application d’aide à l’orthophonie',

    parkType: 'MOBILE · BACKEND',
    parkTitle: 'Park and Go',

    serviceWord: 'SERVICE',
    servicesLabel: '/SERVICES',

    serviceFullStack: 'Développement Full-Stack',
    serviceAI: 'Intelligence Artificielle & NLP',
    serviceRealtime: 'Simulation & Temps Réel',

    experienceWord: 'EXPÉRIENCE',
    experienceLabel: '/EXPÉRIENCE',
    experienceTotal: '3+ ans d’expérience',

    isrCompany: 'ISR – Université de Coimbra',
    isrRole: 'Ingénieure R&D – Projet de fin d’études',
    isrDate: 'Fév. 2026 – Juil. 2026',

    redstartRole: 'Stagiaire développeuse Full-Stack',
    redstartDate: 'Juin 2024 – Août 2024',

    st2iRole: 'Stagiaire développeuse Backend',
    st2iDate: 'Août 2023 – Sept. 2023',

    contactAvailability: 'Disponible pour un nouveau projet',
    contactHeadline: 'VOUS AVEZ UN PROJET<br>EN TÊTE&nbsp;?',

    scroll: 'SCROLL'
  },

  en: {
    documentTitle: 'Yasmine Ben Slim — Software Engineer',
    languageLabel: 'Choose language',

    availability: 'Available for a New Project',

    navWork: 'Work',
    navServices: 'Services',
    navExperience: 'Experience',
    navContact: 'Contact',

    talk: 'Let’s Talk',

    jobTitle: 'Software Engineer',
    tagline: 'I build robust software,<br>from AI to real-time systems.',
    collaborate: 'Let’s collaborate',

    selectedWork: '/SELECTED WORK',

    hapticType: 'MEDICAL SIMULATION',
    hapticTitle: 'Haptic Dental Simulator',

    recipeType: 'NLP · DEEP LEARNING',
    recipeTitle: 'Recipe Generation Transformer',

    speechType: 'MOBILE · VISION',
    speechTitle: 'Speech Therapy Assistance App',

    parkType: 'MOBILE · BACKEND',
    parkTitle: 'Park and Go',

    serviceWord: 'SERVICE',
    servicesLabel: '/SERVICES',

    serviceFullStack: 'Full-Stack Development',
    serviceAI: 'Artificial Intelligence & NLP',
    serviceRealtime: 'Simulation & Real-Time Systems',

    experienceWord: 'EXPERIENCE',
    experienceLabel: '/EXPERIENCE',
    experienceTotal: '3+ years of experience',

    isrCompany: 'ISR – University of Coimbra',
    isrRole: 'R&D Engineer – Final-Year Project',
    isrDate: 'Feb. 2026 – Jul. 2026',

    redstartRole: 'Full-Stack Developer Intern',
    redstartDate: 'Jun. 2024 – Aug. 2024',

    st2iRole: 'Backend Developer Intern',
    st2iDate: 'Aug. 2023 – Sep. 2023',

    contactAvailability: 'Available for a New Project',
    contactHeadline: 'HAVE A PROJECT<br>IN MIND?',

    scroll: 'SCROLL'
  }
};


function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}


function setHTML(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.innerHTML = value;
  }
}


function applyLanguage(language, save = true) {
  const lang = translations[language] ? language : 'fr';
  const t = translations[lang];

  document.documentElement.lang = lang;
  document.title = t.documentTitle;


  /* Language switcher */

  const switcher = document.querySelector('.language-switcher');

  if (switcher) {
    switcher.setAttribute('aria-label', t.languageLabel);
  }


  document.querySelectorAll('.language-option').forEach(button => {
    const active = button.dataset.lang === lang;

    button.classList.toggle('is-active', active);

    button.setAttribute(
      'aria-pressed',
      active ? 'true' : 'false'
    );
  });


  /* Hero */

  setHTML(
    '.availability-pill',
    '<span class="available-dot" aria-hidden="true"></span>' +
    t.availability
  );


  const navLinks = document.querySelectorAll('.nav-center a');

  if (navLinks[0]) {
    navLinks[0].innerHTML =
      `${t.navWork} <span>[04]</span>`;
  }

  if (navLinks[1]) {
    navLinks[1].innerHTML =
      `${t.navServices} <span>[3]</span>`;
  }

  if (navLinks[2]) {
    navLinks[2].innerHTML =
      `${t.navExperience} <span>[3y+]</span>`;
  }

  if (navLinks[3]) {
    navLinks[3].textContent = t.navContact;
  }


  setHTML(
    '.nav-right .pill-button',
    `${t.talk} <span class="button-arrow" aria-hidden="true">↗</span>`
  );


  setText('.job-title', t.jobTitle);

  setHTML('.tagline', t.tagline);


  setHTML(
    '.left-text-block .pill-button',
    `${t.collaborate} <span class="button-arrow" aria-hidden="true">↗</span>`
  );


  /* Projects */

  setText('#work-label', t.selectedWork);


  const projectTypes =
    document.querySelectorAll('.thumb-type');

  const projectTitles =
    document.querySelectorAll('.project-meta h2');


  if (projectTypes[0]) {
    projectTypes[0].textContent = t.hapticType;
  }

  if (projectTitles[0]) {
    projectTitles[0].textContent = t.hapticTitle;
  }


  if (projectTypes[1]) {
    projectTypes[1].textContent = t.recipeType;
  }

  if (projectTitles[1]) {
    projectTitles[1].textContent = t.recipeTitle;
  }


  if (projectTypes[2]) {
    projectTypes[2].textContent = t.speechType;
  }

  if (projectTitles[2]) {
    projectTitles[2].textContent = t.speechTitle;
  }


  if (projectTypes[3]) {
    projectTypes[3].textContent = t.parkType;
  }

  if (projectTitles[3]) {
    projectTitles[3].textContent = t.parkTitle;
  }


  /* Services */

  setText(
    '.service-section .section-word',
    t.serviceWord
  );

  setText(
    '#service-label',
    t.servicesLabel
  );


  const serviceTitles =
    document.querySelectorAll('.service-row h2');


  if (serviceTitles[0]) {
    serviceTitles[0].textContent =
      t.serviceFullStack;
  }

  if (serviceTitles[1]) {
    serviceTitles[1].textContent =
      t.serviceAI;
  }

  if (serviceTitles[2]) {
    serviceTitles[2].textContent =
      t.serviceRealtime;
  }


  /* Experience */

  setText(
    '.experience-section .section-word',
    t.experienceWord
  );

  setText(
    '#experience-label',
    t.experienceLabel
  );

  setText(
    '.experience-total',
    t.experienceTotal
  );


  const experienceCompanies =
  document.querySelectorAll('.experience-copy h2');

const experienceRoles =
  document.querySelectorAll('.experience-copy p');

const experienceDates =
  document.querySelectorAll('.experience-row time');

  if (experienceCompanies[0]) {
  experienceCompanies[0].textContent = t.isrCompany;
}

  if (experienceRoles[0]) {
    experienceRoles[0].textContent = t.isrRole;
  }

  if (experienceDates[0]) {
    experienceDates[0].textContent = t.isrDate;
  }


  if (experienceRoles[1]) {
    experienceRoles[1].textContent =
      t.redstartRole;
  }

  if (experienceDates[1]) {
    experienceDates[1].textContent =
      t.redstartDate;
  }


  if (experienceRoles[2]) {
    experienceRoles[2].textContent =
      t.st2iRole;
  }

  if (experienceDates[2]) {
    experienceDates[2].textContent =
      t.st2iDate;
  }


  /* Contact */

  setHTML(
    '.contact-availability',
    '<span class="available-dot" aria-hidden="true"></span>' +
    t.contactAvailability
  );

  setHTML(
    '#contact-heading',
    t.contactHeadline
  );

  setText(
    '.scroll-hint > span:last-child',
    t.scroll
  );


  /* Save visitor preference */

  if (save) {
    try {
      localStorage.setItem(
        'portfolio-language',
        lang
      );
    } catch (_) {}
  }


  /* Recalculate portrait/layout after changing text */

  requestAnimationFrame(layout);
}


function setupLanguageSwitcher() {
  document
    .querySelectorAll('.language-option')
    .forEach(button => {

      button.addEventListener('click', () => {
        applyLanguage(button.dataset.lang);
      });

    });


  let initialLanguage = 'fr';

  try {

    const saved =
      localStorage.getItem('portfolio-language');

    if (saved === 'fr' || saved === 'en') {
      initialLanguage = saved;
    }

  } catch (_) {}


  applyLanguage(initialLanguage, false);
}

  function findFirstNonTransparentRow(img) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      for (let y = 0; y < canvas.height; y += 1) {
        const rowStart = y * canvas.width * 4;
        for (let x = 0; x < canvas.width; x += 1) {
          if (data[rowStart + x * 4 + 3] > 0) return y;
        }
      }
    } catch (_) {
      // A safe fallback keeps the portrait usable even if canvas pixel access fails.
    }
    return 0;
  }

  function fitDesktopName() {
    if (!desktop.matches) {
      name.style.fontSize = '';
      return;
    }
    const heroWidth = hero.clientWidth;
    const targetWidth = heroWidth * 0.9;
    const viewportWidth = window.innerWidth;
    let size = Math.min(180, Math.max(64, viewportWidth * 0.11));
    name.style.fontSize = `${size}px`;

    while (name.getBoundingClientRect().width > targetWidth && size > 64) {
      size -= 1;
      name.style.fontSize = `${size}px`;
    }
  }

  function positionDesktopPortrait() {
    if (!desktop.matches || !portraitImage.naturalWidth) {
      portraitStack.style.top = '';
      portraitStack.style.width = '';
      portraitStack.style.height = '';
      return;
    }

    const heroWidth = hero.clientWidth;
    const heroHeight = hero.clientHeight;
    const width = Math.min(heroWidth * 0.5, heroHeight * 0.9);
    const renderedHeight = width * aspectRatio;
    portraitStack.style.width = `${width}px`;
    portraitStack.style.height = `${renderedHeight}px`;

    const nameRect = name.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const nameTop = nameRect.top - heroRect.top;
    const targetHairY = nameTop + nameRect.height * 0.82;
    const renderedHairOffset = renderedHeight * topAlphaRatio;
    portraitStack.style.top = `${targetHairY - renderedHairOffset}px`;
  }

  function layout() {
    fitDesktopName();
    positionDesktopPortrait();
  }

  function measurePortrait() {
    if (!portraitImage.naturalWidth || !portraitImage.naturalHeight) return;
    const firstRow = findFirstNonTransparentRow(portraitImage);
    topAlphaRatio = firstRow / portraitImage.naturalHeight;
    aspectRatio = portraitImage.naturalHeight / portraitImage.naturalWidth;
    layout();
  }

  function revealElement(el, delay = 0, duration = 0.8) {
    if (!el || el.dataset.motionRevealed === 'true') return;
    el.dataset.motionRevealed = 'true';
    el.style.setProperty('--reveal-delay', `${delay}s`);
    el.style.animationDuration = `${duration}s`;
    el.classList.add('motion-standard-reveal');
    el.addEventListener('animationend', () => {
      el.classList.remove('motion-standard-reveal');
      el.style.removeProperty('--reveal-delay');
      el.style.animationDuration = '';
    }, { once: true });
  }

  function revealSection(index) {
    if (revealedSections.has(index)) return;
    revealedSections.add(index);

    if (reducedMotion.matches) {
      document.documentElement.classList.add('motion-fallback');
      return;
    }

    if (index === 0) {
      revealElement(firstName, 0.10, 0.9);
      revealElement(remainingName, 0.25, 0.9);
      revealElement(leftBlock, 0.60, 0.8);
      revealElement(socialBlock, 0.75, 0.8);
      portraitStack.dataset.motionRevealed = 'true';
      portraitStack.classList.add('portrait-enter');
      portraitStack.addEventListener('animationend', () => portraitStack.classList.remove('portrait-enter'), { once: true });
      return;
    }

    if (index === 1) {
      projectCards.forEach((card, i) => revealElement(card, 0.05 + i * 0.10, 0.8));
      return;
    }

    if (index === 2) {
      serviceRows.forEach((row, i) => revealElement(row, 0.05 + i * 0.10, 0.8));
      return;
    }

    if (index === 3) {
      experienceRows.forEach((row, i) => revealElement(row, 0.05 + i * 0.08, 0.8));
      return;
    }

    if (index === 4) revealElement(contactBlock, 0, 0.8);
  }

  function updateDots(index) {
    sectionDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function updateProgress() {
    if (!progressBar) return;
    if (desktop.matches) {
      const max = Math.max(1, scrollArea.scrollHeight - scrollArea.clientHeight);
      const progress = Math.max(0, Math.min(1, scrollArea.scrollTop / max));
      progressBar.style.width = `${progress * 100}%`;
    } else {
      const root = document.documentElement;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / max));
      progressBar.style.width = `${progress * 100}%`;
    }
  }

  function activateSection(index) {
    const clamped = Math.max(0, Math.min(sections.length - 1, index));
    currentIndex = clamped;
    updateDots(clamped);
    revealSection(clamped);
  }

  function visibleRatio(section, viewportTop, viewportBottom) {
    const rect = section.getBoundingClientRect();
    const top = Math.max(rect.top, viewportTop);
    const bottom = Math.min(rect.bottom, viewportBottom);
    return Math.max(0, bottom - top) / Math.max(1, rect.height);
  }

  function detectActiveSection() {
    const viewportTop = desktop.matches ? scrollArea.getBoundingClientRect().top : 0;
    const viewportBottom = desktop.matches ? scrollArea.getBoundingClientRect().bottom : window.innerHeight;
    let bestIndex = currentIndex;
    let bestRatio = -1;

    sections.forEach((section, index) => {
      const ratio = visibleRatio(section, viewportTop, viewportBottom);
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = index;
      }
    });

    // 45% is the intended active threshold. For tall mobile sections, choose the most-visible
    // section so entrances can never remain stuck invisible.
    if (bestRatio >= 0.45 || !desktop.matches) activateSection(bestIndex);
    updateProgress();
  }

  function sectionTargetTop(index) {
    if (!desktop.matches) {
      const rect = sections[index].getBoundingClientRect();
      return window.scrollY + rect.top;
    }
    return sections[index].offsetTop;
  }

  function smoothScrollToSection(index, duration = 760) {
    index = Math.max(0, Math.min(sections.length - 1, index));
    const target = sectionTargetTop(index);

    if (reducedMotion.matches) {
      if (desktop.matches) scrollArea.scrollTop = target;
      else window.scrollTo(0, target);
      activateSection(index);
      return Promise.resolve();
    }

    if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
    const start = desktop.matches ? scrollArea.scrollTop : window.scrollY;
    const delta = target - start;
    const started = performance.now();

    return new Promise(resolve => {
      const step = now => {
        const elapsed = now - started;
        const t = Math.min(1, elapsed / duration);
        const value = start + delta * standardEase(t);
        if (desktop.matches) scrollArea.scrollTop = value;
        else window.scrollTo(0, value);

        if (t < 1) {
          scrollAnimationFrame = requestAnimationFrame(step);
        } else {
          if (desktop.matches) scrollArea.scrollTop = target;
          else window.scrollTo(0, target);
          activateSection(index);
          updateProgress();
          scrollAnimationFrame = 0;
          resolve();
        }
      };
      scrollAnimationFrame = requestAnimationFrame(step);
    });
  }

  function releaseWheelLockWhenQuiet() {
    const waitForQuiet = () => {
      const quietFor = performance.now() - lastWheelEventAt;
      if (quietFor >= 180) {
        isAnimatingScroll = false;
      } else {
        window.setTimeout(waitForQuiet, 180 - quietFor + 10);
      }
    };
    waitForQuiet();
  }

  function onWheel(event) {
    if (!desktop.matches || event.ctrlKey) return;
    event.preventDefault();
    lastWheelEventAt = performance.now();
    if (isAnimatingScroll || Math.abs(event.deltaY) < 2) return;

    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
    if (nextIndex === currentIndex) return;

    isAnimatingScroll = true;
    smoothScrollToSection(nextIndex).then(releaseWheelLockWhenQuiet);
  }

  function setupAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        const id = anchor.getAttribute('href');
        const target = document.querySelector(id);
        const index = sections.indexOf(target);
        if (index < 0) return;
        event.preventDefault();
        smoothScrollToSection(index);
      });
    });
  }

  function setupDots() {
    sectionDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (desktop.matches) smoothScrollToSection(index);
      });
    });
  }

  function setupKeyboard() {
    window.addEventListener('keydown', event => {
      if (!desktop.matches) return;
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (currentIndex < sections.length - 1) smoothScrollToSection(currentIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (currentIndex > 0) smoothScrollToSection(currentIndex - 1);
      }
    });
  }

  function setupCustomCursor() {
    if (!mouseDevice.matches || !desktop.matches) return;
    cursorEl = document.createElement('div');
    cursorEl.className = 'custom-cursor is-hidden';
    cursorEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorEl);

    const interactive = 'a, button, .service-row, .experience-row';
    let x = -100;
    let y = -100;

    const draw = () => {
      if (!cursorEl) return;
      cursorEl.style.left = `${x}px`;
      cursorEl.style.top = `${y}px`;
    };

    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      cursorEl.classList.remove('is-hidden');
      cursorEl.classList.toggle('is-large', Boolean(event.target.closest(interactive)));
      draw();
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => cursorEl?.classList.add('is-hidden'));
    document.documentElement.addEventListener('mouseenter', () => cursorEl?.classList.remove('is-hidden'));
  }

  function setupPortraitReveal() {
    if (!mouseDevice.matches || !desktop.matches || !portraitGray) return;
    portraitStack.addEventListener('pointermove', event => {
      const rect = portraitStack.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      portraitGray.style.setProperty('--reveal-x', `${x}px`);
      portraitGray.style.setProperty('--reveal-y', `${y}px`);
      portraitGray.classList.add('portrait-reveal-active');
    });
    portraitStack.addEventListener('pointerleave', () => {
      portraitGray.classList.remove('portrait-reveal-active');
    });
  }

  function setupExperiencePreview() {
    if (!mouseDevice.matches || !desktop.matches || experienceRows.length === 0) return;

    const images = [
      'assets/projects/haptic-simulator.png',
      'assets/projects/orthophonie-app.png',
      'assets/projects/park-and-go.png',
      'assets/projects/recipe-generation-transformer.png'
    ];

    previewEl = document.createElement('div');
    previewEl.className = 'experience-preview';
    previewEl.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.alt = '';
    previewEl.appendChild(img);
    document.body.appendChild(previewEl);

    const movePreview = event => {
      const cardW = 230;
      const cardH = 150;
      let x = event.clientX + 24;
      let y = event.clientY - cardH / 2;
      x = Math.min(x, window.innerWidth - cardW - 12);
      y = Math.max(12, Math.min(y, window.innerHeight - cardH - 12));
      previewEl.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(-4deg)`;
    };

    experienceRows.forEach((row, index) => {
      row.addEventListener('pointerenter', event => {
        img.src = images[index % images.length];
        movePreview(event);
        previewEl.classList.add('is-visible');
      });
      row.addEventListener('pointermove', movePreview);
      row.addEventListener('pointerleave', () => previewEl.classList.remove('is-visible'));
    });
  }

  function setupResponsiveListeners() {
    const refresh = () => {
      layout();
      detectActiveSection();
      if (!desktop.matches) {
        isAnimatingScroll = false;
        portraitGray?.classList.remove('portrait-reveal-active');
      }
    };
    desktop.addEventListener?.('change', refresh);
    window.addEventListener('resize', refresh);
  }

  function init() {
    window.clearTimeout(window.__motionFallback);
    setupLanguageSwitcher();
    if (portraitImage.complete) measurePortrait();
    else portraitImage.addEventListener('load', measurePortrait, { once: true });

    if (document.fonts?.ready) document.fonts.ready.then(layout);

    // Hero is active immediately and starts its exact load sequence.
    activateSection(0);
    updateProgress();

    scrollArea.addEventListener('scroll', detectActiveSection, { passive: true });
    window.addEventListener('scroll', detectActiveSection, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });

    setupAnchors();
    setupDots();
    setupKeyboard();
    setupCustomCursor();
    setupPortraitReveal();
    setupExperiencePreview();
    setupResponsiveListeners();
    requestAnimationFrame(detectActiveSection);

    // Failsafe: if an unexpected runtime error interrupts later animation logic,
    // reveal everything rather than leaving content inaccessible.
    window.setTimeout(() => {
      document.documentElement.classList.add('motion-runtime-ready');
    }, 2600);
  }

  try {
    init();
  } catch (error) {
    document.documentElement.classList.add('motion-fallback');
    console.error('Portfolio motion initialization failed:', error);
  }
})();
