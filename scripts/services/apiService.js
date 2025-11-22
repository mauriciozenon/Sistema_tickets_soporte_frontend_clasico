

async function getAsync(entidad, parametros) {
  let url = `${API_BASE}/${entidad}`;
  if (parametros) {
    url += '?' + parametros;
  }

  const res = await fetch(`${url}`);
  return res.json();
}

async function postAsync(entidad, data) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function putAsync(entidad, data) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function patchAsync(entidad, data) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

async function deleteAsync(entidad) {
  const res = await fetch(`${API_BASE}/${entidad}`, {
    method: 'DELETE'
  });
  return res.json();
}

