const API_BASE = 'http://localhost:3000/api';
const ticketsBody = document.getElementById('ticketsBody');


document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    document.getElementById('nombre-usuario').textContent = usuario.nombre;
    document.getElementById('rol-usuario').textContent =
      usuario.rol === 'administrador' ? 'Administrador' : 'Cliente';
  } else {
    // Redirigir si no está logueado
    window.location.href = 'login.html';
  }

  cargarTickets();
});

function actualizarResumen(tickets) {
  const total = tickets.length;
  const pendientes = tickets.filter(t => t.estado === 'pendiente').length;
  const procesados = tickets.filter(t => t.estado === 'trabajando').length;
  const cerrados = tickets.filter(t => t.estado === 'cerrado').length;

  document.querySelector('.card.total span').textContent = total;
  document.querySelector('.card.pendiente span').textContent = pendientes;
  document.querySelector('.card.proceso span').textContent = procesados;
  document.querySelector('.card.cerrado span').textContent = cerrados;
}
async function cargarTickets() {
  try {
    let url = `${API_BASE}/tickets`;

    if (usuario.rol === 'cliente') {
      url += `?id_usuario=${usuario.id_usuario}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    renderTickets(data.tickets);
    actualizarResumen(data.tickets);
  } catch (error) {
    console.error('Error al cargar tickets:', error);
    ticketsBody.innerHTML = `<tr><td colspan="6">No se pudieron cargar los tickets.</td></tr>`;
  }
}

function renderTickets(tickets) {
  ticketsBody.innerHTML = '';

  if (tickets.length === 0) {
    ticketsBody.innerHTML = `<tr><td colspan="6">No hay tickets para mostrar.</td></tr>`;
    return;
  }

  tickets.forEach(ticket => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${new Date(ticket.fecha_hora).toLocaleString()}</td>
      <td>${ticket.id_usuario}</td>
      <td>${ticket.asunto}</td>
      <td>${ticket.descripcion}</td>
      <td><span class="estado ${ticket.estado}">${ticket.estado}</span></td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-eliminar">Eliminar</button>
      </td>
    `;
    ticketsBody.appendChild(row);
  });
}