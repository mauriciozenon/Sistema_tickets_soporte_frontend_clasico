// REGISTER
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMsg = document.getElementById('error');
  const goLoginBtn = document.getElementById('goLogin');

  // Redirigir al login
  if (goLoginBtn) {
    goLoginBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  // Enviar formulario de registro
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.textContent = '';

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const rol = 'cliente'; // Hardcoded for security

      if (!nombre || !email || !password) {
        errorMsg.textContent = 'Completá todos los campos.';
        return;
      }

      try {
        await postAsync('usuarios', { nombre, email, password, rol });

        localStorage.setItem('email_verificacion', email);

        window.location.href = '../components/verificar-email.html';
      } catch (err) {
        console.error('Error de red:', err);
        errorMsg.textContent = err.message || 'No se pudo conectar con el servidor.';
      }
    });
  }
});
