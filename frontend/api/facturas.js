export async function addFactura(factura) {
  const res = await fetch("http://localhost:5000/api/facturas", {
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
