document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function () {
    const button = document.getElementById('submitButton');
    if (!button) return;

    button.textContent = 'Accediendo...';
    button.disabled = true;
  });
});
