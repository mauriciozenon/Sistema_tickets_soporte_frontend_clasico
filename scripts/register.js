// REGISTER
document.addEventListener('DOMContentLoaded', () => {
  console.log('Register.js loaded');
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

      const loader = document.getElementById('loader');
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const rol = 'cliente'; // Hardcoded for security

      if (!nombre || !email || !password) {
        errorMsg.textContent = 'Completá todos los campos.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorMsg.textContent = 'Ingresá un correo electrónico válido.';
        return;
      }

      try {
        if (loader) loader.classList.add('active');
        const data = await postAsync('usuarios', { nombre, email, password, rol });

        if (data.error || !data.usuario) {
          if (loader) loader.classList.remove('active');
          const msg = (data.mensaje || '').toLowerCase();
          if (msg.includes('correo') || msg.includes('email') || msg.includes('registrad') || msg.includes('duplicad') || msg.includes('exist')) {
            errorMsg.textContent = 'Este correo electrónico ya está registrado. Intentá con otro.';
          } else {
            errorMsg.textContent = data.mensaje || 'Error al registrar.';
          }
          return;
        }

        // Guardar usuario en localStorage (opcional)
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        window.location.href = data.usuario.rol === 'administrador'
          ? './dashboard.html'
          : './cliente/dashboard-cliente.html';
      } catch (err) {
        if (loader) loader.classList.remove('active');
        // console.error('Error de red:', err);
        errorMsg.textContent = 'No se pudo conectar con el servidor.';
        showToast(err.message);
      }
    });
  }
});