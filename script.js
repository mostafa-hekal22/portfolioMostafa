// ============================================================
// Mostafa Hekal — Portfolio interactivity
// ============================================================

(function () {
  const root = document.documentElement;
  const THEME_KEY = 'mh-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  // Init theme (defaults to dark)
  let savedTheme = null;
  try { savedTheme = window.localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(savedTheme || 'dark');

  const modeToggle = document.querySelector('[data-mode-toggle]');
  if (modeToggle) {
    modeToggle.addEventListener('click', function () {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try { window.localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  // Navbar scroll state
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

// Mobile menu (Fixed for Mobile Touch)
  const burger = document.querySelector('[data-burger]');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    const toggleMenu = (e) => {
      e.preventDefault(); // بيمنع أي تداخل في اللمس المزدوج
      e.stopPropagation();
      const open = navLinks.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    burger.addEventListener('click', toggleMenu);
    burger.addEventListener('touchstart', toggleMenu, { passive: false });

    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('nav-open'))
    );
  }

  // Smooth scroll for in-page nav links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Avatar fallback: if mostafa-image.png fails to load, show initials
  const avatarImg = document.querySelector('[data-avatar]');
  if (avatarImg) {
    avatarImg.addEventListener('error', function () {
      this.style.display = 'none';
      const fallback = document.querySelector('[data-avatar-fallback]');
      if (fallback) fallback.style.display = 'flex';
    });
  }

  // Back to top
  const backToTop = document.querySelector('[data-back-to-top]');
  if (backToTop) {
    backToTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // Set active nav link on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove('active'));
            const match = document.querySelector(
              `.nav-links a[href="#${entry.target.id}"]`
            );
            if (match) match.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => navIO.observe(s));
  }
})();
