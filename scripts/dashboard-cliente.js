// ✅ dashboard-cliente.js corregido
const API_BASE = 'http://localhost:3000/api';
let usuario = null;
let currentPage = 1;
let limit = 10;
let totalTickets = 0;

document.addEventListener('DOMContentLoaded', () => {
  usuario = JSON.parse(localStorage.getItem('usuario'));

  // Verificar login
  if (!usuario || usuario.rol !== 'cliente') {
    window.location.href = 'login.html';
    return;
  }
  // Manejar cambio de límite
  const limitSelect = document.getElementById('limitSelect');
  if (limitSelect) {
    limitSelect.value = limit;
    limitSelect.addEventListener('change', (e) => {
      limit = parseInt(e.target.value, 10);
      currentPage = 1;
      cargarTickets();
    });
  }

  document.getElementById('nombre-usuario').textContent = usuario.nombre;

  // Cargar tickets al iniciar
  cargarTickets();

  // Manejo del formulario de creación
  const form = document.getElementById('ticketForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nuevoTicket = {
        id_usuario: usuario.id_usuario,
        asunto: document.getElementById('asunto').value.trim(),
        descripcion: document.getElementById('descripcion').value.trim(),
        prioridad: document.getElementById('prioridad').value || 'media',
        estado: 'pendiente'
      };

      if (!nuevoTicket.asunto || !nuevoTicket.descripcion) {
        showToast('⚠️ Completa todos los campos', 'warning');
        return;
      }

      await crearTicket(nuevoTicket);
      e.target.reset();
    });
  }

  // Abrir modal
  const btnCrear = document.getElementById('btnCrearTicket');
  if (btnCrear) {
    btnCrear.addEventListener('click', () => {
      document.querySelector('.modal-overlay').style.display = 'flex';
    });
  }

  // Cerrar modal
  const btnVolver = document.getElementById('volver');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      document.querySelector('.modal-overlay').style.display = 'none';
    });
  }
});

// ✅ Crear ticket
async function crearTicket(nuevoTicket) {
  try {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoTicket)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al crear el ticket');
    }

    showToast(`✅ Ticket "${nuevoTicket.asunto}" creado con éxito`, 'success');
    cargarTickets();

    document.querySelector('.modal-overlay').style.display = 'none';
    document.getElementById('ticketForm').reset();
  } catch (error) {
    console.error('Error al crear ticket:', error);
    showToast('❌ No se pudo crear el ticket. Intenta nuevamente.', 'error');
  }
}

// ✅ Cargar tickets del cliente
async function cargarTickets() {
  try {
    const res = await fetch(`${API_BASE}/tickets?id_usuario=${usuario.id_usuario}&limit=${limit}&page=${currentPage}`);
    const data = await res.json();

    console.log('Respuesta del backend:', data);

    if (!res.ok || !data.tickets) throw new Error('Error al obtener los tickets');

    totalTickets = data.total || data.tickets.length;
    renderTickets(data.tickets);
    actualizarResumen(data.tickets);
    renderPagination();
  } catch (error) {
    console.error('Error al cargar tickets:', error);
    showToast('No se pudieron cargar los tickets', 'error');
  }
}

// ✅ Renderizar paginación
function renderPagination() {
  const totalPages = Math.ceil(totalTickets / limit);
  const container = document.getElementById('pagination');
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.addEventListener('click', () => {
      currentPage = i;
      cargarTickets();
    });
    container.appendChild(btn);
  }
}

// ✅ Actualizar resumen
function actualizarResumen(tickets) {
  const total = tickets.length;
  const pendientes = tickets.filter(t => t.estado === 'pendiente').length;
  const proceso = tickets.filter(t => t.estado === 'trabajando').length;
  const cerrados = tickets.filter(t => t.estado === 'cerrado').length;

  document.getElementById('total-tickets').textContent = total;
  document.getElementById('pendientes').textContent = pendientes;
  document.getElementById('proceso').textContent = proceso;
  document.getElementById('cerrados').textContent = cerrados;
}

// ✅ Renderizar tickets
function renderTickets(tickets) {
  const tbody = document.getElementById('ticketsBody');
  tbody.innerHTML = '';

  if (tickets.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p>No tienes tickets registrados aún.</p>
          <p style="margin-top: 0.5rem; font-size: 0.9rem;">Crea tu primer ticket usando el botón "+ Nuevo Ticket"</p>
        </td>
      </tr>
    `;
    return;
  }

  tickets.forEach(ticket => {
    const row = document.createElement('tr');
    const fecha = new Date(ticket.fecha_hora).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    row.innerHTML = `
      <td>${fecha}</td>
      <td><strong>${ticket.asunto}</strong></td>
      <td>${ticket.descripcion}</td>
      <td><span class="prioridad ${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span></td>
      <td><span class="estado ${ticket.estado}">${getEstadoText(ticket.estado)}</span></td>
    `;

    tbody.appendChild(row);
  });
}

// ✅ Texto legible para el estado
function getEstadoText(estado) {
  const estados = {
    pendiente: 'Pendiente',
    trabajando: 'En Proceso',
    cerrado: 'Cerrado'
  };
  return estados[estado] || estado;
}

// ✅ Toast estilizado
function showToast(message, type = 'info') {
  const $toast = $(`
    <div class="toast ${type}">
      <button class="close-btn">&times;</button>
      ${message}
    </div>
  `);

  $('#toast-container').append($toast);

  $toast.find('.close-btn').on('click', () => {
    $toast.stop().fadeOut(300, () => $toast.remove());
  });

  setTimeout(() => {
    $toast.fadeOut(400, () => $toast.remove());
  }, 3000);
}
