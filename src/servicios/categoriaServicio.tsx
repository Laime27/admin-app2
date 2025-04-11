import axios from "@/libs/axios";

export const ListarCategorias = async () => {
    try {
        const response = await axios.get('/api/categoria');
        return response.data;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        throw new Error("Error de conexión con el servidor");
    }
}

export const CrearCategoria = async (nombre: string) => {
    try {
        const response = await axios.post('/api/categoria', { nombre });
        return response.data;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}

export const ActualizarCategoria = async (id: number, nombre: string) => {
    try {
        const response = await axios.put(`/api/categoria/${id}`, { nombre });
        return response.data;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}


export const EliminarCategoria = async (id: number) => {    
    try {
        const response = await axios.delete(`/api/categoria/${id}`);
        return response.data;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}

export const ObtenerCategoria = async (id: number) => { 
    try {
        const response = await axios.get(`/api/categoria/${id}`);
        return response.data;

    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}



