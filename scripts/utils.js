function showToast(message, type = 'info') {
  const $toast = $(`
    <div class="toast ${type}">
      <button class="close-btn">&times;</button>
      ${message}
    </div>
  `);

  $('#toast-container').append($toast);

  // Cierre manual
  $toast.find('.close-btn').on('click', () => {
    $toast.stop().fadeOut(300, () => $toast.remove());
  });

  // Cierre automático
  setTimeout(() => {
    $toast.animate({ opacity: 0, marginTop: '-110px' }, 400, () => $toast.remove());
  }, 3000);
}

function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-wrapper');
      const input = wrapper.querySelector('input');
      const icon = btn.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });
}

initPasswordToggles();

async function construirFiltros(entidad) {
  let filtros = {};   // <--- OBJETO, no string

  try {
    switch (entidad) {
      case 'tickets':

        if (usuario.rol === 'administrador') {

          const idUsuario = $('#filterIdUsuario').val().trim();
          if (idUsuario) filtros.id_usuario = idUsuario;

          const prioridad = $('#filterPrioridad').val();
          if (prioridad && prioridad !== '0') filtros.prioridad = prioridad;

          const filtroActivo = $('#filterActivo').val();
          if (filtroActivo !== '') filtros.activo = filtroActivo;

          const estado = $('#filterEstado').val();
          if (estado && estado !== '0') filtros.estado = estado;
        }

        // Si es cliente, fuerza su ID
        if (usuario.rol === 'cliente') {
          filtros.id_usuario = usuario.id_usuario;
        }

        break;
    }

  } catch (error) {
    console.error(error);
  }

  return filtros;
}
