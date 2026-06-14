const GAS_URL = 'https://script.google.com/macros/s/AKfycbwxBvUMkCBXTGoI2AjrN4RcK8P7jK4pPQFQPy_qtknK9kApNidFUjVjqnKS5JBbfwxa/exec';
const form        = document.getElementById('contact-form');
const successMsg  = document.getElementById('form-success');
const errorMsg    = document.getElementById('form-error');
const submitBtn   = document.getElementById('submit-btn');
const submitLabel = document.getElementById('submit-label');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  submitBtn.disabled = true;
  submitLabel.textContent = '送信中…';
  errorMsg.classList.add('hidden');

  try {
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams(new FormData(form)),
    });
    form.classList.add('hidden');
    successMsg.classList.remove('hidden');
  } catch {
    errorMsg.classList.remove('hidden');
    submitBtn.disabled = false;
    submitLabel.textContent = '送信する →';
  }
});
