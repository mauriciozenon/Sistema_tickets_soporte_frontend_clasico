// Detalle Ticket Admin y Chat con Firebase
let ticketId = null;
let usuario = null;
let chatUnsubscribe = null;

// Obtener ID del ticket desde la URL
function getTicketIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Cargar información del ticket
async function cargarTicket() {
    ticketId = getTicketIdFromURL();

    if (!ticketId) {
        showToast('No se encontró el ID del ticket', 'error');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }

    try {
        const data = await getAsync(`tickets/${ticketId}`);

        if (!data || !data.ticket) {
            showToast('No se pudo cargar la información del ticket', 'error');
            return;
        }

        const ticket = data.ticket;

        // Llenar información del ticket
        document.getElementById('ticket-asunto').textContent = ticket.asunto || 'Sin asunto';
        document.getElementById('ticket-descripcion').textContent = ticket.descripcion || 'Sin descripción';
        document.getElementById('ticket-id').textContent = `#${ticket.id_ticket}`;
        document.getElementById('ticket-fecha').textContent = new Date(ticket.fecha_hora).toLocaleString('es-ES');

        // Información del cliente (si viene en la respuesta)
        if (ticket.usuario) {
            document.getElementById('ticket-cliente').textContent = ticket.usuario.nombre || 'Cliente';
        } else {
            document.getElementById('ticket-cliente').textContent = 'Cliente #' + ticket.id_usuario;
        }
        // Actualizar badges
        actualizarBadges(ticket.prioridad, ticket.estado);

        // Pre-seleccionar valores en los controles de admin
        document.getElementById('select-estado').value = ticket.estado || 'pendiente';
        document.getElementById('select-prioridad').value = ticket.prioridad || 'baja';

        // Deshabilitar chat si el ticket está cerrado
        if (ticket.estado === 'cerrado') {
            document.getElementById('message-input').disabled = true;
            document.getElementById('btn-send').disabled = true;
            document.getElementById('message-input').placeholder = 'El ticket está cerrado. No se pueden enviar más mensajes.';
        }

        // Inicializar chat después de cargar el ticket
        inicializarChat();

    } catch (error) {
        console.error('Error al cargar ticket:', error);
        showToast('Error al cargar la información del ticket', 'error');
    }
}

function actualizarBadges(prioridad, estado) {
    // Prioridad
    const prioridadEl = document.getElementById('ticket-prioridad');
    prioridadEl.textContent = (prioridad || 'baja').toUpperCase();
    prioridadEl.className = `badge prioridad ${prioridad || 'baja'}`;

    // Estado
    const estadoEl = document.getElementById('ticket-estado');
    estadoEl.textContent = (estado || 'pendiente').charAt(0).toUpperCase() + (estado || 'pendiente').slice(1);
    estadoEl.className = `badge estado ${estado || 'pendiente'}`;
}

// Actualizar ticket (Estado y Prioridad)
async function actualizarTicket() {
    const nuevoEstado = document.getElementById('select-estado').value;
    const nuevaPrioridad = document.getElementById('select-prioridad').value;
    const btnActualizar = document.getElementById('btn-actualizar-ticket');

    btnActualizar.disabled = true;
    btnActualizar.innerHTML = '<i class="bi bi-hourglass-split"></i> Guardando...';

    try {
        const response = await putAsync(`tickets/${ticketId}`, {
            estado: nuevoEstado,
            prioridad: nuevaPrioridad
        });

        if (!response.error) {
            showToast('Ticket actualizado correctamente', 'success');
            actualizarBadges(nuevaPrioridad, nuevoEstado);
        } else {
            showToast(response.message || 'Error al actualizar el ticket', 'error');
        }
    } catch (error) {
        console.error('Error al actualizar ticket:', error);
        showToast('Error de conexión al actualizar el ticket', 'error');
    } finally {
        btnActualizar.disabled = false;
        btnActualizar.innerHTML = '<i class="bi bi-save"></i> Guardar Cambios';
    }
}

// Inicializar chat con Firebase
function inicializarChat() {
    if (!window.firebaseDb || !ticketId) {
        console.error('Firebase no está inicializado o falta el ID del ticket');
        showToast('Error al inicializar el chat. Verifica la configuración de Firebase.', 'error');
        return;
    }

    const db = window.firebaseDb;
    const collection = window.firebaseCollection;
    const query = window.firebaseQuery;
    const orderBy = window.firebaseOrderBy;
    const onSnapshot = window.firebaseOnSnapshot;

    // Referencia a la colección de mensajes del ticket
    const mensajesRef = collection(db, `tickets/${ticketId}/mensajes`);

    // Query ordenado por timestamp
    const q = query(mensajesRef, orderBy('timestamp', 'asc'));

    // Limpiar mensajes anteriores
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    // Escuchar cambios en tiempo real
    chatUnsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            chatMessages.innerHTML = `
        <div class="empty-chat">
          <i class="bi bi-chat-left-text"></i>
          <p>No hay mensajes aún.</p>
        </div>
      `;
            return;
        }

        chatMessages.innerHTML = '';

        snapshot.forEach((doc) => {
            const mensaje = doc.data();
            mostrarMensaje(mensaje);
        });

        // Scroll al final
        scrollToBottom();
    }, (error) => {
        console.error('Error al escuchar mensajes:', error);
        showToast('Error al cargar los mensajes', 'error');
    });
}

// Mostrar un mensaje en el chat
function mostrarMensaje(mensaje) {
    const chatMessages = document.getElementById('chat-messages');

    // Remover mensaje de carga si existe
    const loadingMsg = chatMessages.querySelector('.loading-message');
    if (loadingMsg) {
        loadingMsg.remove();
    }

    // Remover mensaje vacío si existe
    const emptyChat = chatMessages.querySelector('.empty-chat');
    if (emptyChat) {
        emptyChat.remove();
    }

    // Lógica inversa al cliente: 'soporte' soy yo (el admin)
    const esSoporte = mensaje.autor === 'soporte' || mensaje.autorId === usuario?.id_usuario;
    const claseMensaje = esSoporte ? 'cliente' : 'soporte'; // Reuso clases CSS: 'cliente' es el mensaje propio (derecha), 'soporte' es el otro (izquierda)

    // En el CSS del cliente:
    // .message.cliente -> align-self: flex-end (Derecha, color primario)
    // .message.soporte -> align-self: flex-start (Izquierda, gris)

    // Para el admin:
    // Mis mensajes (Soporte) -> Derecha (.cliente en CSS existente)
    // Mensajes del usuario (Cliente) -> Izquierda (.soporte en CSS existente)

    const nombreAutor = esSoporte ? 'Tú (Soporte)' : (mensaje.autorNombre || 'Cliente');

    // Formatear fecha
    let fechaTexto = 'Ahora';
    if (mensaje.timestamp) {
        const fecha = mensaje.timestamp.toDate ? mensaje.timestamp.toDate() : new Date(mensaje.timestamp);
        const ahora = new Date();
        const diff = ahora - fecha;

        if (diff < 60000) { // Menos de 1 minuto
            fechaTexto = 'Ahora';
        } else if (diff < 3600000) { // Menos de 1 hora
            const minutos = Math.floor(diff / 60000);
            fechaTexto = `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        } else if (diff < 86400000) { // Menos de 1 día
            fechaTexto = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else {
            fechaTexto = fecha.toLocaleString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    const mensajeHTML = `
    <div class="message ${claseMensaje}">
      <div class="message-bubble">${mensaje.texto || mensaje.mensaje || ''}</div>
      <div class="message-info">
        <span class="message-author">${nombreAutor}</span>
        <span class="message-time">${fechaTexto}</span>
      </div>
    </div>
  `;

    chatMessages.insertAdjacentHTML('beforeend', mensajeHTML);
}

// Enviar mensaje
async function enviarMensaje(texto) {
    if (!texto.trim()) {
        showToast('No puedes enviar un mensaje vacío', 'warning');
        return;
    }

    if (!window.firebaseDb || !ticketId || !usuario) {
        showToast('Error: No se pudo enviar el mensaje', 'error');
        return;
    }

    const db = window.firebaseDb;
    const collection = window.firebaseCollection;
    const addDoc = window.firebaseAddDoc;
    const serverTimestamp = window.firebaseServerTimestamp;

    try {
        const mensajesRef = collection(db, `tickets/${ticketId}/mensajes`);

        await addDoc(mensajesRef, {
            texto: texto.trim(),
            autor: 'soporte', // Identificador fijo para soporte
            autorId: usuario.id_usuario,
            autorNombre: usuario.nombre || 'Soporte',
            timestamp: serverTimestamp(),
            leido: false
        });

        // Limpiar input
        document.getElementById('message-input').value = '';
        actualizarContadorCaracteres();

        // Scroll al final
        scrollToBottom();

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        showToast('Error al enviar el mensaje. Intenta nuevamente.', 'error');
    }
}

// Scroll al final del chat
function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// Actualizar contador de caracteres
function actualizarContadorCaracteres() {
    const input = document.getElementById('message-input');
    const contador = document.getElementById('char-count');
    const longitud = input.value.length;
    contador.textContent = longitud;

    if (longitud > 450) {
        contador.style.color = '#ef4444';
    } else if (longitud > 400) {
        contador.style.color = '#f59e0b';
    } else {
        contador.style.color = '#9ca3af';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Obtener usuario del localStorage
    usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
        showToast('Debes iniciar sesión para ver el ticket', 'error');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        return;
    }

    if (usuario.rol !== 'administrador') {
        showToast('No tienes permisos para ver esta página', 'error');
        setTimeout(() => {
            window.location.href = 'cliente/dashboard-cliente.html';
        }, 2000);
        return;
    }

    // Mostrar información del usuario
    document.getElementById('nombre-usuario').textContent = usuario.nombre || 'Administrador';
    document.getElementById('rol-usuario').textContent = 'Administrador';

    // Cargar ticket
    cargarTicket();

    // Event listeners
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const btnActualizar = document.getElementById('btn-actualizar-ticket');

    // Botón actualizar ticket
    if (btnActualizar) {
        btnActualizar.addEventListener('click', actualizarTicket);
    }

    // Formulario de chat
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const texto = messageInput.value.trim();
        if (texto) {
            const btnSend = document.getElementById('btn-send');
            btnSend.disabled = true;
            btnSend.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';

            await enviarMensaje(texto);

            btnSend.disabled = false;
            btnSend.innerHTML = '<i class="bi bi-send-fill"></i> Enviar Respuesta';
        }
    });

    // Contador de caracteres
    messageInput.addEventListener('input', actualizarContadorCaracteres);

    // Enter para enviar (Shift+Enter para nueva línea)
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Limpiar suscripción al salir
window.addEventListener('beforeunload', () => {
    if (chatUnsubscribe) {
        chatUnsubscribe();
    }
});
