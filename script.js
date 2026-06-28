const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');
const toast = document.querySelector('[data-toast]');
const year = document.querySelector('#year');
const copyButtons = document.querySelectorAll('[data-copy-email]');
const revealItems = document.querySelectorAll('.reveal');
const navAnchors = document.querySelectorAll('.nav-links a');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1900);
}

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      showToast('Email copied: ' + email);
    } catch (error) {
      window.location.href = 'mailto:' + email;
    }
  });
});

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 })
  : null;

revealItems.forEach((item) => {
  if (revealObserver) {
    revealObserver.observe(item);
  } else {
    item.classList.add('visible');
  }
});

const sectionObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' })
  : null;

if (sectionObserver) {
  document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));
}
