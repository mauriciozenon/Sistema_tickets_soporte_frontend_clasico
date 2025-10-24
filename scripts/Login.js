// ---------------- LOGIN / REGISTER ----------------
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorEl = document.getElementById('error');

const goRegisterBtn = document.getElementById('goRegister');
const goLoginBtn = document.getElementById('goLogin');

if (goRegisterBtn) {
  goRegisterBtn.addEventListener('click', () => {
    window.location.href = 'register.html';
  });
}

if (goLoginBtn) {
  goLoginBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = ''; // Limpiar errores anteriores

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || 'Credenciales inválidas';
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      window.location.href = data.usuario.rol === 'administrador'
        ? 'dashboard.html'
        : 'tickets.html';
    } catch (err) {
      console.error('Error de red:', err);
      errorEl.textContent = 'No se pudo conectar con el servidor.';
    }
  });
}