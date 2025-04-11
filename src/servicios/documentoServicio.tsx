import axios from "@/libs/axios";



export const listarDocumentos = async () => {
    const response = await axios.get("/api/documentos");
    return response.data;
}


export const subirDocumento = async (formData: FormData) => {
    const response = await axios.post("/api/documentos", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

 export const obtenerDatosDocumento = async (id: number) => {
    const response = await axios.get(`/api/documentos/${id}`);
    return response.data;
 }


 export const actualizarDocumento = async (id: number, formData: FormData) => {
    const response = await axios.post(`/api/documentos/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
 }

