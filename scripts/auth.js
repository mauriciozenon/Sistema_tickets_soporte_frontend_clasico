export const esAdmin = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario?.rol === 'administrador';
};