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
      let res = null;
      let message = '';
      if (idTicket) {
        message = 'Ticket actualizado con éxito';
        res = await fetch(`${API_BASE}/tickets/${idTicket}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },          
          body: JSON.stringify({
            asunto,
            descripcion,
            prioridad,
            estado,
            id_usuario: usuario.id_usuario
          })
        });
      } else {
        message = 'Ticket creado con éxito';
        res = await fetch(`${API_BASE}/tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asunto,
            descripcion,
            prioridad,
            id_usuario: usuario.id_usuario
          })
        });
      }
      const data = await res.json();

      if (!res.ok) {
        showToast('Error al crear o actualizar el ticket.', 'error');
        // errorEl.textContent = data.error || 'Error al crear el ticket.';
        return;
      }
      showToast(message, 'success');
      $('.modal-overlay').fadeOut(300, () => {
         $('#estado').hide();
        search();
      });
    } catch (err) {
      errorEl.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});

document.getElementById('volver').addEventListener('click', () => {
  $('.modal-overlay').fadeOut(300, () => {
    $('#estado').hide();
  });
});

document.getElementById('btnCrearTicket').addEventListener('click', () => {
  $('.modal-overlay').find('input, textarea').val('').prop('disabled', false);
  $('#prioridad').val('');

  $('.modal-overlay').fadeIn();

});


async function abrirModalEdicion(data) {
  $('#asunto').prop('disabled', true).val(data.asunto);
  $('#descripcion').prop('disabled', true).val(data.descripcion);
  $('#prioridad').val(data.prioridad);
  $('#idTicket').val(data.id_ticket);
  $('#estado').val(data.estado).show();
  $('.modal-overlay').fadeIn(300);
}