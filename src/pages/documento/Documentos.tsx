import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Download, Eye, Upload, X, User, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { listarDocumentos, subirDocumento, actualizarDocumento , descargarDocumento } from "@/servicios/documentoServicio";

import { ListarUsuarios } from "@/servicios/usuarioServicio";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
}


interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  tamaño: string;
  fechaCreacion: string;
  propietario: string;
  usuario_id?: number;
  descripcion?: string;
  nombre_documentos?: string;
  created_at?: string;
  usuario?: Usuario;
  ruta_archivo?: string;
}



const Documentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("listado");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [documentoEditando, setDocumentoEditando] = useState<Documento | null>(null);
  const [formErrors, setFormErrors] = useState<{
    archivo?: string;
    usuario_id?: string;
    general?: string;
  }>({});
  const [formData, setFormData] = useState<Partial<Documento>>({
    nombre: "",
    tipo: "",
    descripcion: "",
    usuario_id: undefined
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);


  const [documentos, setDocumentos] = useState<Documento[]>([]);



  const ListarDocumentos = async () => {
    const response = await listarDocumentos();
    setDocumentos(response);

  }

  const listarUsuarios = async () => {
    const response = await ListarUsuarios();
    setUsuarios(response);
  }

  useEffect(() => {
    listarUsuarios();

    ListarDocumentos();

  }, []);

 
 

  // Filtrar documentos basados en el término de búsqueda
  const filteredDocumentos = documentos.filter(
    (documento) =>
      documento.nombre_documentos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // Si se selecciona un usuario, actualizar también el propietario
    if (field === "usuario_id" && value) {
      const usuarioSeleccionado = usuarios.find(u => u.id === parseInt(value));
      if (usuarioSeleccionado) {
        setFormData(prev => ({
          ...prev,
          propietario: usuarioSeleccionado.nombre
        }));
      }
    }
  };


//   const descargarDocumento = (url: string, nombreArchivo: string) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", nombreArchivo); 
//     link.style.display = "none";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// };



const descargarDocumentoSeleccionado = async (nombreDocumento: string) => {
  try {
    const blob = await descargarDocumento(nombreDocumento);

    const url = window.URL.createObjectURL(new Blob([blob]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreDocumento); // nombre con el que se descarga
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url); // limpieza
  } catch (error) {
    console.error('Error al descargar el documento:', error);
  }
};


  // Función para manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Extraer el tipo de archivo de la extensión
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || '';
      
      setFormData(prev => ({
        ...prev,
        nombre: file.name,
        tipo: fileExtension

      }));
    }
  };

 

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    
    if (!selectedFile) {
      setFormErrors(prev => ({
        ...prev,
        archivo: "Por favor seleccione un archivo"
      }));
      return;
    }

    if (!formData.usuario_id) {
      setFormErrors(prev => ({
        ...prev,
        usuario_id: "Por favor seleccione un usuario"
      }));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('archivo', selectedFile);
    formDataToSend.append('usuario_id', formData.usuario_id?.toString() || '');
    formDataToSend.append('descripcion', formData.descripcion || '');

    try {
      await subirDocumento(formDataToSend);
      await ListarDocumentos();
      setFormData({
        nombre: "",
        tipo: "",
        descripcion: "",
        usuario_id: undefined
      });
      setSelectedFile(null);
      setShowUploadDialog(false);
      setFormErrors({});
    } catch (error) {
      console.error("Error al subir el documento:", error);
      setFormErrors(prev => ({
        ...prev,
        general: "Error al subir el documento. Por favor intente nuevamente."
      }));
    }
  };

  const handleEditDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    
    if (!documentoEditando) return;

    if (!formData.usuario_id) {
      setFormErrors(prev => ({
        ...prev,
        usuario_id: "Por favor seleccione un usuario"
      }));
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('_method', 'PUT');
    if (selectedFile) {
      formDataToSend.append('archivo', selectedFile);
    }
    formDataToSend.append('usuario_id', formData.usuario_id?.toString() || '');
    formDataToSend.append('descripcion', formData.descripcion || '');

    try {
      await actualizarDocumento(documentoEditando.id, formDataToSend);
      await ListarDocumentos();
      setShowEditDialog(false);
      setDocumentoEditando(null);
      setFormData({
        nombre: "",
        tipo: "",
        descripcion: "",
        usuario_id: undefined
      });
      setSelectedFile(null);
      setFormErrors({});
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      setFormErrors(prev => ({
        ...prev,
        general: "Error al actualizar el documento. Por favor intente nuevamente."
      }));
    }
  };

  const abrirDialogoEdicion = (documento: Documento) => {
    setDocumentoEditando(documento);
    setFormData({
      nombre: documento.nombre_documentos,
      tipo: documento.tipo,
      descripcion: documento.descripcion,
      usuario_id: documento.usuario_id
    });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6"> 
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Documentos</h1>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Subir Documento</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Subir Nuevo Documento</DialogTitle>
              <DialogDescription>
                Seleccione un archivo y asígnelo a un usuario del sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadDocument} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Seleccionar Archivo *</Label>
                <Input 
                  id="file" 
                  type="file" 
                  onChange={handleFileChange}
                  
                />
                {formErrors.archivo && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.archivo}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usuario_id">Asignar a Usuario *</Label>
                <Select 
                  value={formData.usuario_id?.toString() || ""} 
                  onValueChange={(value) => handleInputChange("usuario_id", parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map(usuario => (
                      <SelectItem key={usuario.id} value={usuario.id.toString()}>
                        {usuario.nombre} ({usuario.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.usuario_id && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.usuario_id}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  El documento será asociado a este usuario
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea 
                  id="descripcion" 
                  value={formData.descripcion || ""} 
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Breve descripción del documento"
                  className="min-h-[80px]"
                />
              </div>
              
              {formErrors.general && (
                <p className="text-sm text-red-500">{formErrors.general}</p>
              )}
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUploadDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Subir Documento</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <FileText size={20} />
            <span>Documentos del Sistema</span>
          </CardTitle>
          <CardDescription>
            Gestione los documentos asociados a los usuarios y trámites.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar documentos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocumentos.length > 0 ? (
                  filteredDocumentos.map((documento) => (
                    <TableRow key={documento.id}>
                      <TableCell>{documento.id}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        {documento.nombre_documentos}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                          {documento.tipo}
                        </span>
                      </TableCell>
                      <TableCell>{documento.tamaño}</TableCell>
                      <TableCell>{documento.created_at}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-blue-500" />
                          <span>{documento.usuario.nombre}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                        
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Editar documento"
                            onClick={() => abrirDialogoEdicion(documento)}
                          >
                            <Edit size={16} />
                          </Button>
                          <button onClick={() => descargarDocumentoSeleccionado(documento.nombre_documentos)}>
                            <Download size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                     no hay documentos...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Modifique los datos del documento. Solo el usuario es obligatorio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDocument} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Actualizar Archivo</Label>
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional - Deje vacío para mantener el archivo actual
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usuario_id">Asignar a Usuario *</Label>
              <Select 
                value={formData.usuario_id?.toString() || ""} 
                onValueChange={(value) => handleInputChange("usuario_id", parseInt(value))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un usuario" />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map(usuario => (
                    <SelectItem key={usuario.id} value={usuario.id.toString()}>
                      {usuario.nombre} ({usuario.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.usuario_id && (
                <p className="text-sm text-red-500 mt-1">{formErrors.usuario_id}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea 
                id="descripcion" 
                value={formData.descripcion || ""} 
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Breve descripción del documento"
                className="min-h-[80px]"
              />
            </div>
            
            {formErrors.general && (
              <p className="text-sm text-red-500">{formErrors.general}</p>
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowEditDialog(false);
                  setDocumentoEditando(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Actualizar Documento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documentos;
