/* =========================================================
   contact.js — message form: client validation + Web3Forms
   Falls back to mailto if no access key is configured.
   ========================================================= */
(function () {
  'use strict';

  const WEB3FORMS_KEY = 'ff34fdd6-bde5-4152-b327-033920b231f5';
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  const form = document.getElementById('msgForm');
  if (!form) return;

  const status = document.getElementById('mf-status');
  const btn = document.getElementById('mf-btn');
  const nameEl = document.getElementById('mf-name');
  const emailEl = document.getElementById('mf-email');
  const msgEl = document.getElementById('mf-msg');
  const isAr = () => (window.isArabic ? window.isArabic() : document.documentElement.dir === 'rtl');

  const T = {
    name: { en: 'Please enter your name.', ar: 'من فضلك أدخل اسمك.' },
    email: { en: 'Please enter a valid email.', ar: 'من فضلك أدخل بريداً صحيحاً.' },
    msg: { en: 'Please write a short message.', ar: 'من فضلك اكتب رسالة قصيرة.' },
  };

  function setError(input, errId, msg) {
    const err = document.getElementById(errId);
    if (msg) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = msg; err.classList.add('show'); }
      return false;
    }
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    if (err) { err.textContent = ''; err.classList.remove('show'); }
    return true;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    const ar = isAr();
    let ok = true;
    if (!nameEl.value.trim()) ok = setError(nameEl, 'err-name', ar ? T.name.ar : T.name.en) && ok;
    else setError(nameEl, 'err-name', '');
    if (!emailRe.test(emailEl.value.trim())) ok = setError(emailEl, 'err-email', ar ? T.email.ar : T.email.en) && ok;
    else setError(emailEl, 'err-email', '');
    if (msgEl.value.trim().length < 5) ok = setError(msgEl, 'err-msg', ar ? T.msg.ar : T.msg.en) && ok;
    else setError(msgEl, 'err-msg', '');
    return ok;
  }

  // Clear a field's error as the user fixes it.
  [nameEl, emailEl, msgEl].forEach((el) => {
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    // Fallback: open mail client if key not set.
    if (WEB3FORMS_KEY.includes('YOUR_ACCESS_KEY_HERE')) {
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:mahmoudsabrynasr@gmail.com?subject=${subject}&body=${body}`;
      return;
    }

    btn.disabled = true;
    status.className = 'msg-status';
    status.textContent = isAr() ? 'جارٍ الإرسال…' : 'Sending…';

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name, email, message,
          from_name: name,
          subject: `Portfolio message from ${name}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        form.reset();
        status.className = 'msg-status ok';
        status.textContent = isAr() ? '✓ تم الإرسال — سأرد عبر البريد قريباً.' : '✓ Sent — I\'ll reply by email soon.';
      } else {
        throw new Error(data.message || 'bad response');
      }
    } catch (err) {
      status.className = 'msg-status err';
      status.textContent = isAr()
        ? '✗ فشل الإرسال. راسلني مباشرة: mahmoudsabrynasr@gmail.com'
        : '✗ Failed. Email me directly: mahmoudsabrynasr@gmail.com';
    } finally {
      btn.disabled = false;
    }
  });
})();
