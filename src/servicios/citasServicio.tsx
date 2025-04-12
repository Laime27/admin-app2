import axios from "@/libs/axios";



export const listarCitas = async () => {
    try {
        const response = await axios.get("/api/citas");
        return response.data;
    } catch (error) {
        console.error("Error al obtener citas:", error);
    }
}


export const obtenerCitaDatos = async (id: number) => {
    try {
        const response = await axios.get(`/api/citas/${id}`);    
        return response.data;

    } catch (error) {
        console.error("Error al obtener cita:", error);
     
    }
}


export const crearCita = async (cita: any) => {
    try {
        const response = await axios.post("/api/citas", cita);
        return response.data;
    } catch (error) {
        console.error("Error al crear cita:", error);
    }
}   


export const actualizarCita = async (id: number, cita: any) => {
    try {
        const response = await axios.put(`/api/citas/${id}`, cita);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar cita:", error);
    }
}

export const historialCita = async (id: number) => {
    try {
        const response = await axios.get(`/api/listar_historial_citas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener historial de cita:", error);
    }
}

export const eliminarCita = async (id: number) => {
    try {
        const response = await axios.delete(`/api/citas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar cita:", error);
    }
}




