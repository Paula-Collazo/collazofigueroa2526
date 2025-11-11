import axios from "axios";

const API_URL = "http://localhost:3000/noticias";

export const getNoticias = (params = {}) =>
  axios.get(API_URL, { params }).then(res => res.data);

export const addNoticia = (nuevaNoticia) =>
  axios.post(API_URL, nuevaNoticia).then(res => res.data);

export const deleteNoticia = (id) =>
  axios.delete(`${API_URL}/${id}`).then(res => res.data);

export const updateNoticia = (id, noticiaActualizada) =>
  axios.put(`${API_URL}/${id}`, noticiaActualizada).then(res => res.data);

export const getNoticiaPorId = (id) =>
  axios.get(`${API_URL}/${id}`).then(res => res.data);
