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
    const colspan = usuario && usuario.rol === 'administrador' ? 8 : 5;
    ticketsBody.innerHTML = `<tr><td colspan="${colspan}">No se pudieron cargar los tickets.</td></tr>`;
  }
}
async function searchTickets() {
  try {
    let filtros = await construirFiltros('tickets');
    const data = await getAsync('tickets', (filtros ? filtros : null));
    const colspan = usuario && usuario.rol === 'administrador' ? 8 : 5;

    if (!data || !data.tickets) {
      ticketsBody.innerHTML = `<tr><td colspan="${colspan}">No se pudieron cargar los tickets.</td></tr>`;
      return;
    }

    renderTickets(data.tickets);
    actualizarResumen(data.tickets);
  } catch (error) {
    console.error('Error al buscar tickets:', error);
    const colspan = usuario && usuario.rol === 'administrador' ? 8 : 5;
    ticketsBody.innerHTML = `<tr><td colspan="${colspan}">No se pudieron cargar los tickets.</td></tr>`;
  }
}

document.getElementById('filterActivo')?.addEventListener('change', () => {
  searchTickets();
});

function renderTickets(tickets) {
  ticketsBody.innerHTML = '';

  const colspan = usuario.rol === 'administrador' ? 8 : 5;


  if (tickets.length === 0) {
    ticketsBody.innerHTML = `<tr><td colspan="${colspan}">No hay tickets para mostrar.</td></tr>`;
    return;
  }

  tickets.forEach(ticket => {
    const row = document.createElement('tr');
    const ticketId = ticket.id_ticket || ticket.id;

    if (usuario.rol === 'administrador') {
      row.innerHTML = `
      <td data-label="Fecha">${new Date(ticket.fecha_hora).toLocaleString()}</td>
      <td data-label="ID Cliente">${ticket.id_usuario}</td>
      <td data-label="Cliente">${ticket.nombre}</td>
      <td data-label="Título"><span class="truncado">${ticket.asunto}</span></td>
      <td data-label="Descripción"><span title="${ticket.descripcion}" class="truncado descripcion-ticket">${ticket.descripcion}</span></td>
      <td data-label="Prioridad"><span class="prioridad ${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span></td>
      <td data-label="Estado"><span class="estado ${ticket.estado}">${ticket.estado}</span></td>
      <td data-label="Acciones">
        <button class="btn-action btn-ver">Ver</button>
        <button class="btn-action btn-editar">Editar</button>
        <button class="btn-action btn-eliminar">Eliminar</button>
      </td>
    `;
    }
    else {
      row.innerHTML = `
      <td data-label="Fecha/Hora">${new Date(ticket.fecha_hora).toLocaleString()}</td>
      <td data-label="Asunto">${ticket.asunto}</td>
      <td data-label="Descripción">${ticket.descripcion}</td>
      <td data-label="Prioridad"><span class="prioridad ${ticket.prioridad}">${ticket.prioridad.toUpperCase()}</span></td>
      <td data-label="Estado"><span class="estado ${ticket.estado}">${ticket.estado}</span></td>
    `;
      // Hacer la fila clickeable para clientes
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `detalle-ticket.html?id=${ticketId}`;
      });
    }
    $(row).data('idTicket', ticketId);
    ticketsBody.appendChild(row);
  });
}

$(document).on('click', '.btn-ver', function (evento) {
  const idTicket = $(this).closest('tr').data('idTicket');
  window.location.href = `detalle-ticket.html?id=${idTicket}`;
});

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
    // Borrado lógico: Obtener ticket completo, cambiar activo a false y hacer PUT
    const ticketData = await getTicketDetails(idTicket);
    if (!ticketData) return;

    ticketData.activo = 0;

    // Usar putAsync del servicio
    const data = await putAsync(`tickets/${idTicket}`, ticketData);

    if (data.error) {
      alert(data.error || 'Error al eliminar el ticket.');
      return;
    }
    $('#modal-confirmacion').fadeOut();
    showToast('Ticket eliminado con éxito', 'success');
    searchTickets();
  } catch (err) {
    console.error(err);
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
