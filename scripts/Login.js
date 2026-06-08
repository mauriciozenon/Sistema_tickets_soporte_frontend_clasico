// ---------------- LOGIN ----------------
const registerForm = document.getElementById('registerForm');

const goRegisterBtn = document.getElementById('goRegister');
const goLoginBtn = document.getElementById('goLogin');

if (goRegisterBtn) {
  goRegisterBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });
}

// LOGIN
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl.textContent = '';
      errorEl.classList.add('hidden');

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        const data = await postAsync('auth/login', { email, password });

        const usuario = data.usuario || {
          id_usuario: data.id_usuario,
          nombre: data.nombre,
          rol: data.rol
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));

        window.location.href = usuario.rol === 'administrador'
          ? './components/dashboard.html'
          : './components/cliente/dashboard-cliente.html';

      } catch (err) {
        console.error('Error de red o servidor:', err);
        const msg = err.message || 'No se pudo conectar con el servidor.';
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        showToast(msg, 'error');
      }
    });
  }
});
