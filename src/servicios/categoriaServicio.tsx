import axios from "@/libs/axios";

export const ListarCategorias = async () => {
    try {
        const response = await axios.get('/api/categorias');
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        throw new Error("Error de conexión con el servidor");
    }
}

export const CrearCategoria = async (nombre: string) => {
    try {
        const response = await axios.post('/api/categorias', { nombre });
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}

export const ActualizarCategoria = async (id: number, nombre: string) => {
    try {
        const response = await axios.put(`/api/categorias/${id}`, { nombre });
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}


export const EliminarCategoria = async (id: number) => {    
    try {
        const response = await axios.delete(`/api/categorias/${id}`);
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}

export const ObtenerCategoria = async (id: number) => { 
    try {
        const response = await axios.get(`/api/categorias/${id}`);
        return response;
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
    }
}



