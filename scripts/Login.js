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
      $.ajax({
        async: true,
        url: 'http://localhost:3000/api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function (data, textStatus, jqXHR) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuario', JSON.stringify(data.usuario))
          const usuario = window.JSON.parse(localStorage.getItem('usuario'));
          window.location.href = usuario.rol === 'administrador'
            ? 'dashboard.html'
            : 'tickets.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
          errorEl.textContent = jqXHR.responseJSON?.error || 'Credenciales inválidas';
        }
      });

    } catch (err) {
      console.error('Error de red:', err);
      errorEl.textContent = 'No se pudo conectar con el servidor.';
    }
  });
}