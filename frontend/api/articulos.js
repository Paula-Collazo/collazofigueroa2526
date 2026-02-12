import axios from "axios";

const API_URL = "http://localhost:5000/api/articulos";

// Obtener todos los artículos
export async function getArticulos() {
  const res = await axios.get(API_URL);
  return res.data;
}

// Obtener artículo por ID
export async function getArticuloById(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
}

// Crear artículo
export async function addArticulo(formData) {
  const res = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// Actualizar artículo
export async function updateArticulo(id, articulo) {
  const res = await axios.put(`${API_URL}/${id}`, articulo);
  return res.data;
}

// Eliminar artículo
export async function deleteArticulo(id) {
  await axios.delete(`${API_URL}/${id}`);
}

export async function setCochesToVendido (ids) {
  const res = await axios.put(`${API_URL}/vendido`, {ids})
  return res.data;
}

// Reservar un vehículo
export async function reservarArticulo(id, datosReserva) {
  const res = await axios.put(`${API_URL}/${id}/reservar`, datosReserva);
  return res.data;
}

// Anular reserva (solo admin, necesita token)
export async function anularReserva(id) {
  const token = sessionStorage.getItem("token");
  const res = await axios.put(`${API_URL}/${id}/anular-reserva`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}