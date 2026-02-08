import axios from "axios";

const API_URL = "http://localhost:5000/api/facturas";

export async function addFactura(factura) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(factura)
  });

  if (!res.ok) {
    throw new Error("Error al guardar factura");
  }

  return res.json();
}

export async function obtenerFacturaPorDni(dni) {
  try{
    const response = await axios.get(`${API_URL}/${dni}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener factura:', error)
    throw error;
  }
  
}
