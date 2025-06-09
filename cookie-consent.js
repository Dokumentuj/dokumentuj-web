// ===== Cookie Consent Banner =====
(function() {
  const banner = document.getElementById('cookie-banner');
  const overlay = document.getElementById('cookie-overlay');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  function hide() {
    banner.classList.remove('show');
    overlay.style.display = 'none';
  }

  if (!localStorage.getItem('cookieConsent')) {
    banner.classList.add('show');
    overlay.style.display = 'block';
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    hide();
  });

  declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    hide();
  });
})();
