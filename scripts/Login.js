// ---------------- LOGIN ----------------
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
          // Si el backend no envía "usuario", lo construimos manualmente
          const usuario = data.usuario || {
            id_usuario: data.id_usuario,
            nombre: data.nombre,
            rol: data.rol
          };

          // Guardamos en localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('usuario', JSON.stringify(usuario));

          // Redirección según rol
          window.location.href = usuario.rol === 'administrador'
            ? 'dashboard.html'
            : 'dashboard-cliente.html';
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