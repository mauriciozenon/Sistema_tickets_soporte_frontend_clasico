// ---------------- LOGIN / REGISTER ----------------
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorEl = document.getElementById('error');

const goRegisterBtn = document.getElementById('goRegister');
const goLoginBtn = document.getElementById('goLogin');

if (goRegisterBtn) goRegisterBtn.addEventListener('click', () => window.location.href = 'register.html');
if (goLoginBtn) goLoginBtn.addEventListener('click', () => window.location.href = 'index.html');

// LOGIN
if (loginForm) loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en el login');

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    window.location.href = data.usuario.rol === 'administrador' ? 'dashboard.html' : 'tickets.html';
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

// REGISTER
if (registerForm) registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rol = document.getElementById('rol').value;

  try {
    const res = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nombre, email, password, rol })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error en el registro');

    alert('Registrado correctamente. Ahora logueate.');
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
