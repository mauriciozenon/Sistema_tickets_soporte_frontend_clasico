var usuario = null;

const ticketsBody = document.getElementById('ticketsBody');
let currentPage = 1;
let take = 10; // cantidad por página
let totalPaginas = 1;



document.getElementById('filterPrioridad')?.addEventListener('change', () => {
  searchTickets();
});
document.getElementById('filterEstado')?.addEventListener('change', () => {
  searchTickets();
});
document.getElementById('filterIdUsuario')?.addEventListener('input', () => {
  searchTickets();
});

document.getElementById('limitSelect')?.addEventListener('change', (e) => {
  take = parseInt(e.target.value);
  currentPage = 1;
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

// Logout logic
$(document).on('click', '.cerrar, .btn-logout', function (e) {
  e.preventDefault();
  localStorage.removeItem('usuario');
  window.location.href = $(this).attr('href');
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

    const data = await getAsync('tickets', {
      ...filtros,
      page: currentPage,
      take: take
    });

    const colspan = usuario && usuario.rol === 'administrador' ? 8 : 5;

    if (!data || !data.tickets) {
      ticketsBody.innerHTML = `<tr><td colspan="${colspan}">No se pudieron cargar los tickets.</td></tr>`;
      return;
    }

    renderTickets(data.tickets);
    actualizarResumen(data.tickets);

    // --- actualizar paginador ---
    totalPaginas = data.totalPaginas;
    renderPaginador();

  } catch (error) {
    console.error('Error al buscar tickets:', error);
    const colspan = usuario && usuario.rol === 'administrador' ? 8 : 5;
    ticketsBody.innerHTML = `<tr><td colspan="${colspan}">No se pudieron cargar los tickets.</td></tr>`;
  }
}

function renderPaginador() {
  const paginador = document.getElementById("paginador");
  paginador.innerHTML = "";

  // Botón anterior
  const btnPrev = document.createElement("button");
  btnPrev.textContent = "◀";
  btnPrev.disabled = currentPage === 1;
  btnPrev.onclick = () => cambiarPagina(currentPage - 1);
  paginador.appendChild(btnPrev);

  // Botones numéricos
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) btn.classList.add("active");

    btn.onclick = () => cambiarPagina(i);
    paginador.appendChild(btn);
  }

  // Botón siguiente
  const btnNext = document.createElement("button");
  btnNext.textContent = "▶";
  btnNext.disabled = currentPage === totalPaginas;
  btnNext.onclick = () => cambiarPagina(currentPage + 1);
  paginador.appendChild(btnNext);
}
function cambiarPagina(nuevaPagina) {
  if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
  currentPage = nuevaPagina;
  searchTickets();
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
      let activo = ticket.activo.data[0] && (ticket.activo.data[0] == 1 || ticket.activo.data[0] == true) ? 'activo' : 'inactivo';
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
      $(row).addClass(activo);
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

// --- Lógica de Registro de Usuario (Admin) ---

// Abrir modal
$(document).on('click', '#btnRegistrarUsuario', function () {
  $('#formRegistroAdmin')[0].reset();
  $('#modal-registro-admin').fadeIn();
});

// Cerrar modal
$(document).on('click', '#btnCancelarRegistro', function () {
  $('#modal-registro-admin').fadeOut();
});

// Enviar formulario
$('#formRegistroAdmin').on('submit', async function (e) {
  e.preventDefault();

  const nombre = $('#regNombre').val().trim();
  const email = $('#regEmail').val().trim();
  const password = $('#regPassword').val();
  const rol = $('#regRol').val();

  if (!nombre || !email || !password || !rol) {
    alert('Por favor completá todos los campos.');
    return;
  }

  try {
    const data = await postAsync('usuarios', { nombre, email, password, rol });

    if (data.error || !data.usuario) {
      alert(data.mensaje || 'Error al registrar usuario.');
      return;
    }

    $('#modal-registro-admin').fadeOut();
    showToast('Usuario registrado con éxito', 'success');
  } catch (err) {
    console.error(err);
    alert('Error al conectar con el servidor.');
  }
});
