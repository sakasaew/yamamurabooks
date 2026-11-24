const GAS_URL = 'https://script.google.com/macros/s/AKfycbwxBvUMkCBXTGoI2AjrN4RcK8P7jK4pPQFQPy_qtknK9kApNidFUjVjqnKS5JBbfwxa/exec';
const form        = document.getElementById('contact-form');
const notice      = document.getElementById('form-notice');
const successMsg  = document.getElementById('form-success');
const errorMsg    = document.getElementById('form-error');
const submitBtn   = document.getElementById('submit-btn');
const submitLabel = document.getElementById('submit-label');
const ERROR_DEFAULT = errorMsg.textContent.trim();

const showError = (text) => {
  errorMsg.textContent = text;
  errorMsg.classList.remove('hidden');
};

/* Turnstile のトークンは使い捨て。送信に失敗したら取り直す */
const resetTurnstile = () => {
  if (window.turnstile) window.turnstile.reset();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }

  /* トークンが無いまま送ると、送信先で無言で破棄される（no-cors のため画面には「送信完了」と出てしまう）。
     広告ブロッカー等で Turnstile が読み込めない場合は、送信を止めてメールでの連絡を案内する */
  if (form.querySelector('.cf-turnstile')) {
    const token = form.querySelector('[name="cf-turnstile-response"]');
    if (!token || !token.value) {
      showError('ボット確認が完了していません。少し待ってから、もう一度お試しください。うまく進まない場合は info@yamamurabook.shop まで、メールでご連絡ください。');
      return;
    }
  }

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
    notice.classList.add('hidden');
    successMsg.classList.remove('hidden');
  } catch {
    showError(ERROR_DEFAULT);
    resetTurnstile();
    submitBtn.disabled = false;
    submitLabel.textContent = '送信する →';
  }
});
