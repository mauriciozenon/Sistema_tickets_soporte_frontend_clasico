

async function getAsync (entidad, parametros) {
  let url = `${API_BASE}/${entidad}`;
  if (parametros) {
    url += '?' + parametros;
  }

  const res = await fetch(`${url}`);
  return res.json();
}

