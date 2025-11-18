function showToast(message, type = 'info') {
  const $toast = $(`
    <div class="toast ${type}">
      <button class="close-btn">&times;</button>
      ${message}
    </div>
  `);

  $('#toast-container').append($toast);

  // Cierre manual
  // $toast.find('.close-btn').on('click', () => {
  //   $toast.stop().fadeOut(300, () => $toast.remove());
  // });

  // Cierre automático
  setTimeout(() => {
    $toast.animate({ opacity: 0, marginTop: '-110px' }, 400, () => $toast.remove());
  }, 3000);
}

async function construirFiltros(entidad) {
  let query = '';
  try {
    switch (entidad) {
      case 'tickets':
        if (usuario.rol === 'administrador') {
          // Filtro por Id de usuario
          const idUsuario = $('#filterIdUsuario').val().trim();
          if (idUsuario) query += `&id_usuario=${idUsuario}`;
          // Filtro por prioridad
          const prioridad = $('#filterPrioridad').val();
          if (prioridad && prioridad !== '0') query += `&prioridad=${prioridad}`;
          
          // Filtro por estado
          const estado = $('#filterEstado').val();
          if (estado && estado !== '0') query += `&estado=${estado}`;
        } else {
          if (usuario.id_usuario) query += `&id_usuario=${usuario.id_usuario}`;
        }
        // Si sos cliente, filtramos por tu propio ID
        if (usuario.rol === 'cliente') {
          filtros.id_usuario = usuario.id_usuario;
        }

        break;
      default:
        break;
    }
  } catch (error) {

  }

  return query;
}