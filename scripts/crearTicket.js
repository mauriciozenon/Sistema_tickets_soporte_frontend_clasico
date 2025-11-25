document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticketForm');
  const errorEl = document.getElementById('error');
  const volverBtn = document.getElementById('volver');

  const API_BASE = 'http://localhost:3000/api';
  const usuario = JSON.parse(localStorage.getItem('usuario'));

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
      const idTicket = document.getElementById('idTicket').value;
      const estado = document.getElementById('estado').value;
      let data = null;
      let message = '';
      if (idTicket) {
        message = 'Ticket actualizado con éxito';
        data = await putAsync(`tickets/${idTicket}`, {
          asunto,
          descripcion,
          prioridad,
          estado,
          id_usuario: usuario.id_usuario
        });
      } else {
        message = 'Ticket creado con éxito';
        data = await postAsync('tickets', {
          asunto,
          descripcion,
          prioridad,
          id_usuario: usuario.id_usuario
        });
      }

      if (data.error) {
        showToast('Error al crear o actualizar el ticket.', 'error');
        return;
      }
      showToast(message, 'success');
      $('#modal-crear-ticket').fadeOut(300, () => {
        $('#estado').hide();
        searchTickets();
      });
    } catch (err) {
      errorEl.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});

document.getElementById('volver').addEventListener('click', () => {
  $('#modal-crear-ticket').fadeOut(300, () => {
    $('#estado').hide();
  });
});
if (document.getElementById('btnCrearTicket')) {
  document.getElementById('btnCrearTicket').addEventListener('click', () => {
    $('#modal-crear-ticket').find('input, textarea').val('').prop('disabled', false);
    $('#idTicket').val('');
    $('#estado').hide();
    $('#modal-crear-ticket').fadeIn();
  });
}

async function abrirModalEdicion(data) {
  $('#asunto').prop('disabled', true).val(data.asunto);
  $('#descripcion').prop('disabled', true).val(data.descripcion);
  $('#prioridad').val(data.prioridad);
  $('#idTicket').val(data.id_ticket);
  $('#estado').val(data.estado).show();
  $('#modal-crear-ticket').fadeIn(300);
}