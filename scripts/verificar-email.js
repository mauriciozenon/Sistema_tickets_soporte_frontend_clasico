const API_BASE = 'http://localhost:3000/api';

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
      const res = await fetch(`${API_BASE}/auth/verificar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo })
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.textContent = data.error || 'Error al verificar.';
        errorMsg.classList.remove('hidden');
        showToast(data.error || 'Error al verificar', 'error');
        return;
      }

      localStorage.removeItem('email_verificacion');
      showToast('Cuenta verificada correctamente', 'success');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);

    } catch (err) {
      console.error('Error de red:', err);
      errorMsg.textContent = 'No se pudo conectar con el servidor.';
      errorMsg.classList.remove('hidden');
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
      const res = await fetch(`${API_BASE}/auth/enviar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.textContent = data.error || 'Error al reenviar.';
        errorMsg.classList.remove('hidden');
        showToast(data.error || 'Error al reenviar', 'error');
        return;
      }

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
      errorMsg.textContent = 'No se pudo conectar con el servidor.';
      errorMsg.classList.remove('hidden');
      reenviarBtn.disabled = false;
      reenviarBtn.textContent = 'Reenviar código';
    }
  });
});
