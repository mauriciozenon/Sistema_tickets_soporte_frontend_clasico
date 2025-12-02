
async function getAsync(entidad, parametros) {
  let url = `${API_BASE}/${entidad}`;

  if (parametros && typeof parametros === "object") {
    url += "?" + new URLSearchParams(parametros).toString();
  }

  const res = await fetch(url, {
    credentials: 'include'
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.mensaje || errorData.error) {
        mensaje = errorData.mensaje || errorData.error;
      }
    } catch (e) {
      // Si no es JSON, usamos el statusText
    }
    throw new Error(mensaje);
  }

  return res.json();
}

async function postAsync(entidad, data) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.mensaje || errorData.error) {
        mensaje = errorData.mensaje || errorData.error;
      }
    } catch (e) { }
    throw new Error(mensaje);
  }

  return res.json();
}

async function putAsync(entidad, data) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.mensaje || errorData.error) {
        mensaje = errorData.mensaje || errorData.error;
      }
    } catch (e) { }
    throw new Error(mensaje);
  }

  return res.json();
}

async function patchAsync(entidad, data) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.mensaje || errorData.error) {
        mensaje = errorData.mensaje || errorData.error;
      }
    } catch (e) { }
    throw new Error(mensaje);
  }

  return res.json();
}

async function deleteAsync(entidad) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}: ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.mensaje || errorData.error) {
        mensaje = errorData.mensaje || errorData.error;
      }
    } catch (e) { }
    throw new Error(mensaje);
  }

  return res.json();
}

