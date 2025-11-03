document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  const errorEl = document.getElementById('error');
  const volverBtn = document.getElementById('volver');

  const API_BASE = 'http://localhost:3000/api';
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  volverBtn.addEventListener('click', () => {
    window.location.href = usuario.rol === 'administrador' ? 'dashboard.html' : 'tickets.html';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const asunto = document.getElementById('asunto').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const prioridad = document.getElementById('prioridad').value;

    if (!asunto || !descripcion || !prioridad) {
      errorEl.textContent = 'Completá todos los campos.';
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asunto,
          descripcion,
          prioridad,
          id_usuario: usuario.id_usuario
        })
      });

      const data = await res.json();

      if (!res.ok) {
        errorEl.textContent = data.error || 'Error al crear el ticket.';
        return;
      }

      window.location.href = 'tickets.html';
    } catch (err) {
      errorEl.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});