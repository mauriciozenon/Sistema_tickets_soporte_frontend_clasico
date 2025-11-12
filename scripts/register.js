// REGISTER
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const errorMsg = document.getElementById('error');
  const goLoginBtn = document.getElementById('goLogin');

  const API_BASE = 'http://localhost:3000/api'; // ajustá según tu backend

  // Redirigir al login
  goLoginBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Enviar formulario de registro
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    if (!nombre || !email || !password || !rol) {
      errorMsg.textContent = 'Completá todos los campos.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol })
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.textContent = data.mensaje || 'Error al registrar.';
        return;
      }

      // Guardar usuario en localStorage (opcional)
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      window.location.href = data.usuario.rol === 'administrador'
        ? 'dashboard.html'
        : 'dashboard-cliente.html';
    } catch (err) {
      console.error('Error de red:', err);
      errorMsg.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});