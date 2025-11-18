var usuario = null;
const API_BASE = 'http://localhost:3000/api';
const ticketsBody = document.getElementById('ticketsBody');

document.getElementById('filterPrioridad')?.addEventListener('change', () => {
  searchTickets();
});
document.getElementById('filterEstado')?.addEventListener('change', () => {
  searchTickets();
});
document.getElementById('filterIdUsuario')?.addEventListener('input', () => {
  searchTickets();
});

if ($('#btnBuscar').length) {
  document.getElementById('btnBuscar').addEventListener('click', async () => {
    searchTickets();
  });
}
document.addEventListener('DOMContentLoaded', () => {
  usuario = JSON.parse(localStorage.getItem('usuario'));

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
    await searchTickets();
  } catch (error) {
    console.error('Error al cargar tickets:', error);
    ticketsBody.innerHTML = `<tr><td colspan="6">No se pudieron cargar los tickets.</td></tr>`;
  }
}
async function searchTickets() {
  try {
    let filtros = await construirFiltros('tickets');
    const data = await getAsync('tickets', (filtros ? filtros : null));
    if (!data || !data.tickets) {
      ticketsBody.innerHTML = `<tr><td colspan="6">No se pudieron cargar los tickets.</td></tr>`;
      return;
    }

    if (!data || !data.tickets) {
      ticketsBody.innerHTML = `<tr><td colspan="6">No se pudieron cargar los tickets.</td></tr>`;
      return;
    }



    renderTickets(data.tickets);
    actualizarResumen(data.tickets);
  } catch (error) {
    console.error('Error al buscar tickets:', error);
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

    if (usuario.rol === 'administrador') {
      row.innerHTML = `
      <td>${new Date(ticket.fecha_hora).toLocaleString()}</td>
      <td>${ticket.id_usuario}</td>
      <td>${ticket.nombre}</td>
      <td><span class="truncado">${ticket.asunto}</span></td>
      <td><span class="truncado">${ticket.descripcion}</span></td>
      <td><span class="prioridad ${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span></td>
      <td><span class="estado ${ticket.estado}">${ticket.estado}</span></td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-eliminar">Eliminar</button>
      </td>
    `;
    }
    else {
      row.innerHTML = `
      <td>${new Date(ticket.fecha_hora).toLocaleString()}</td>
      <td>${ticket.asunto}</td>
      <td>${ticket.descripcion}</td>
      <td><span class="prioridad ${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span></td>
      <td><span class="estado ${ticket.estado}">${ticket.estado}</span></td>
    `;
    }
    $(row).data('idTicket', ticket.id_ticket);
    ticketsBody.appendChild(row);
  });
}

$(document).on('click', '.btn-editar', async function (evento) {
  const idTicket = $(this).closest('tr').data('idTicket');
  const data = await getTicketDetails(idTicket);
  if (data) {
    await abrirModalEdicion(data);
  }
});

$(document).on('click', '.btn-eliminar', async function (evento) {
  $('#modal-confirmacion').data('idTicket', $(this).closest('tr').data('idTicket'));
  $('#modal-confirmacion').fadeIn();
});
$(document).on('click', '#btnConfirmar', async function () {
  const idTicket = $(this).closest('#modal-confirmacion').data('idTicket');
  try {
    const res = await fetch(`${API_BASE}/tickets/${idTicket}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Error al eliminar el ticket.');
      return;
    }
    $('#modal-confirmacion').fadeOut();
    showToast('Ticket eliminado con éxito', 'success');
    searchTickets();
  } catch (err) {
    alert('No se pudo conectar con el servidor.');
  }
});
$(document).on('click', '#btnCancelar', function () {
  $('#modal-confirmacion').fadeOut();
});

async function getTicketDetails(idTicket) {
  try {
    const data = await getAsync('tickets/' + idTicket);
    if (!data) {
      alert(data.error || 'Error al obtener detalles del ticket.');
      return null;
    }
    return data.ticket;
  }
  catch (err) {
    alert('No se pudo conectar con el servidor.');
    return null;
  }
}
