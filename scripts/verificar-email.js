document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verificarForm');
  const errorMsg = document.getElementById('error');
  const reenviarBtn = document.getElementById('reenviarBtn');

  const emailInput = document.getElementById('email');

  const emailGuardado = localStorage.getItem('email_verificacion');
  if (emailGuardado) {
    emailInput.value = emailGuardado;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');

    const email = emailInput.value.trim();
    const codigo = document.getElementById('codigo').value.trim();

    if (!email || !codigo) {
      errorMsg.textContent = 'Completá todos los campos.';
      errorMsg.classList.remove('hidden');
      return;
    }

    try {
      const data = await postAsync('auth/verificar-codigo', { email, codigo });

      localStorage.removeItem('email_verificacion');
      showToast('Cuenta verificada correctamente', 'success');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);

    } catch (err) {
      console.error('Error de red:', err);
      const msg = err.message || 'No se pudo conectar con el servidor.';
      errorMsg.textContent = msg;
      errorMsg.classList.remove('hidden');
      showToast(msg, 'error');
    }
  });

  reenviarBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email) {
      errorMsg.textContent = 'Ingresá tu email para reenviar el código.';
      errorMsg.classList.remove('hidden');
      return;
    }

    reenviarBtn.disabled = true;
    reenviarBtn.textContent = 'Enviando...';

    try {
      await postAsync('auth/enviar-codigo', { email });

      showToast('Código reenviado. Revisá tu correo.', 'success');

      let segundos = 60;
      reenviarBtn.textContent = `Reenviar (${segundos}s)`;
      const intervalo = setInterval(() => {
        segundos--;
        reenviarBtn.textContent = `Reenviar (${segundos}s)`;
        if (segundos <= 0) {
          clearInterval(intervalo);
          reenviarBtn.disabled = false;
          reenviarBtn.textContent = 'Reenviar código';
        }
      }, 1000);

    } catch (err) {
      console.error('Error de red:', err);
      const msg = err.message || 'No se pudo conectar con el servidor.';
      errorMsg.textContent = msg;
      errorMsg.classList.remove('hidden');
      showToast(msg, 'error');
      reenviarBtn.disabled = false;
      reenviarBtn.textContent = 'Reenviar código';
    }
  });
});
