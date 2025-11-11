import axios from "axios";

const API_URL = "http://localhost:3000/modelos";

export async function getModelos() {
    try{
        const res = await axios.get(API_URL);
        return res.data;
    }catch(error){
        console.error("Error al conseguir los datos", error)
    }
    
}

export async function addCModelo(coche) {
    try {
        axios.post(API_URL, coche);
    } catch (error) {
        console.error("Error al conseguir los datos", error)
    }
    
}

export async function updateModelo(id, coche) {
    try {
        await axios.put(API_URL + `&${id}`, coche);
    } catch (error) {
         console.error("Error al conseguir los datos", error)
    }
    
}

export async function deleteModelo(id) {
    try {
        await axios.delete(API_URL + `/${id}`)
    } catch (error) {
        console.error("Error al conseguir los datos", error)
    }
    
}

