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