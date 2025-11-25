import axios from "axios";

const API_URL = "http://localhost:3000/citas";

export async function getCita() {
    try{
        const res = await axios.get(API_URL);
        return res.data;
    }catch(error){
        console.error("Error al conseguir los datos", error)
    }
    
}

export async function addCita(cita) {
    try {
        axios.post(API_URL, cita);
    } catch (error) {
        console.error("Error al conseguir los datos", error)
    }
    
}

export async function updateCita(id, cita) {
    try {
        await axios.put(API_URL + `&${id}`, cita);
    } catch (error) {
         console.error("Error al conseguir los datos", error)
    }
    
}

export async function deleteCita(id) {
    try {
        await axios.delete(API_URL + `/${id}`)
    } catch (error) {
        console.error("Error al conseguir los datos", error)
    }
}