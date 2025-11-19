// scripts/tickets.js

const API_BASE = 'http://localhost:3000/api'; // ajustá según tu backend
const ticketsList = document.getElementById('tickets-list');
const filtroEstado = document.getElementById('filtro-estado');
const usuarioNombre = document.getElementById('usuario-nombre');
const btnNuevoTicket = document.getElementById('btn-nuevo-ticket');

// Simulación de usuario logueado (reemplazá con tu lógica real)
const usuario = JSON.parse(localStorage.getItem('usuario'));

// Mostrar nombre
if (usuario && usuario.nombre) {
    usuarioNombre.textContent = usuario.nombre;
}

// Cargar tickets al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarTickets();
});

// Filtro por estado
filtroEstado.addEventListener('change', () => {
    cargarTickets(filtroEstado.value);
});

// Crear nuevo ticket (redirección o modal)
btnNuevoTicket.addEventListener('click', () => {
    window.location.href = 'crear_ticket.html'; // o abrir modal
});

// Obtener tickets desde la API
async function cargarTickets(estado = '') {
    try {
        const res = await fetch(`${API_BASE}/tickets?usuarioId=${usuario.id_usuario}`);
        const data = await res.json();

        const filtrados = estado
            ? data.filter(ticket => ticket.estado === estado)
            : data;

        renderTickets(filtrados);
    } catch (error) {
        console.error('Error al cargar tickets:', error);
        ticketsList.innerHTML = `<p class="error">No se pudieron cargar los tickets.</p>`;
    }
}

// Renderizar tarjetas visuales
function renderTickets(tickets) {
  ticketsList.innerHTML = '';

  if (tickets.length === 0) {
    ticketsList.innerHTML = `<p>No hay tickets para mostrar.</p>`;
    return;
  }

  tickets.forEach(ticket => {
    const card = document.createElement('div');
    card.className = 'ticket-card';

    card.innerHTML = `
      <h3>${ticket.asunto}</h3>
      <p><strong>Prioridad:</strong> ${ticket.prioridad}</p>
      <p><strong>Estado:</strong> <span class="estado">${ticket.estado}</span></p>
      <p><strong>Fecha:</strong> ${new Date(ticket.fecha_hora).toLocaleString()}</p>
      <p>${ticket.descripcion}</p>
    `;

    // Si el usuario es administrador, mostrar selector de estado
    if (esAdmin()) {
      const select = document.createElement('select');
      select.innerHTML = `
        <option value="pendiente">Pendiente</option>
        <option value="trabajando">Trabajando</option>
        <option value="cerrado">Cerrado</option>
      `;
      select.value = ticket.estado;

      select.addEventListener('change', async () => {
        await cambiarEstado(ticket.id_ticket, select.value);
        alert('Estado actualizado');
      });

      select.className = 'estado-selector';
      card.appendChild(select);
    }

    ticketsList.appendChild(card);
  });
}


   