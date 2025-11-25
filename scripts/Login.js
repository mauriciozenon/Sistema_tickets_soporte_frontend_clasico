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
  console.log('Login.js loaded');
  const loginForm = document.getElementById('loginForm');
  const errorEl = document.getElementById('error');

  if (loginForm) {
    console.log('LoginForm found, attaching listener');
    loginForm.addEventListener('submit', async (e) => {
      console.log('Form submitted');
      e.preventDefault();
      if (errorEl) errorEl.textContent = ''; // Limpiar errores anteriores

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        console.log('Calling postAsync');
        const data = await postAsync('auth/login', { email, password });
        console.log('Response:', data);

        if (data.error) {
          showToast(data.mensaje || 'Credenciales inválidas', 'error');
          return;
        }

        // Si el backend no envía "usuario", lo construimos manualmente
        const usuario = data.usuario || {
          id_usuario: data.id_usuario,
          nombre: data.nombre,
          rol: data.rol
        };

        // Guardamos en localStorage solo el usuario
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirección según rol
        window.location.href = usuario.rol === 'administrador'
          ? './components/dashboard.html'
          : './components/cliente/dashboard-cliente.html';

      } catch (err) {
        console.error('Error de red o servidor:', err);
        if (errorEl) errorEl.textContent = err.message || 'No se pudo conectar con el servidor.';
      }
    });
  } else {
    console.log('LoginForm not found');
  }
});