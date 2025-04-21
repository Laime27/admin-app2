import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Download, Eye, Upload, X, User, Edit, ChevronLeft, ChevronRight } from "lucide-react";
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
import { mostrarExito, mostrarError } from "@/lib/toastUtils";

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
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [documentoPreview, setDocumentoPreview] = useState<Documento | null>(null);
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de documentos por página

  const ListarDocumentos = async () => {
    try {
      setIsLoading(true);
      const response = await listarDocumentos();
      setDocumentos(response);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const listarUsuarios = async () => {
    try {
      const response = await ListarUsuarios();
      setUsuarios(response);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }

  useEffect(() => {
    const cargarDatos = async () => {
      await Promise.all([
        listarUsuarios(),
        ListarDocumentos()
       
      ]);
    };
    
    cargarDatos();
  }, []);

 
 

  // Filtrar documentos basados en el término de búsqueda
  const filteredDocumentos = documentos.filter(
    (documento) =>
      documento.nombre_documentos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Calcular documentos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocumentos = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Función para abrir el diálogo de previsualización
  const abrirDialogoPreview = (documento: Documento) => {
    setDocumentoPreview(documento);
    setShowPreviewDialog(true);
  };

  // Función para obtener la URL de previsualización según el tipo de documento
  const getPreviewUrl = (documento: Documento) => {
    if (!documento || !documento.nombre_documentos) return "";
    
    const baseUrl = import.meta.env.VITE_URL_API;
    // Asegurarse de que la URL tenga el formato correcto con el token de autenticación
    const token = localStorage.getItem('token');
    return `${baseUrl}api/documentos/descargar/${documento.nombre_documentos}`;
  };

  // Función para determinar si el documento es una imagen
  const isImageFile = (documento: Documento) => {
    if (!documento || !documento.tipo) return false;
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const fileType = documento.tipo.toLowerCase();
    return imageTypes.some(type => fileType.includes(type));
  };

  // Función para determinar si el documento es un PDF
  const isPdfFile = (documento: Documento) => {
    if (!documento || !documento.tipo) return false;
    return documento.tipo.toLowerCase().includes('pdf');
  };

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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-lg text-gray-500">Cargando documentos...</p>
              </div>
            ) : (
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
                  {currentDocumentos.length > 0 ? (
                    currentDocumentos.map((documento) => (
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
                            <span>{documento.usuario?.nombre}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Ver documento"
                              onClick={() => abrirDialogoPreview(documento)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Editar documento"
                              onClick={() => abrirDialogoEdicion(documento)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Descargar documento"
                              onClick={() => descargarDocumentoSeleccionado(documento.nombre_documentos)}
                            >
                              <Download size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                       No hay documentos...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Paginación */}
          {filteredDocumentos.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDocumentos.length)} de {filteredDocumentos.length} documentos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Página anterior</span>
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </Button>
                )).slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Página siguiente</span>
                </Button>
              </div>
            </div>
          )}
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

      {/* Diálogo de Previsualización */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {documentoPreview?.nombre_documentos}
            </DialogTitle>
            <DialogDescription>
              {documentoPreview?.descripcion || "Sin descripción disponible"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="rounded-md border p-4 bg-gray-50 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Tipo:</span>{" "}
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {documentoPreview?.tipo || "No disponible"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tamaño:</span>{" "}
                  <span className="text-black font-medium">{documentoPreview?.tamaño || "No disponible"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Fecha:</span>{" "}
                  <span className="text-black font-medium">{documentoPreview?.created_at || "No disponible"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Propietario:</span>{" "}
                  <span className="flex items-center gap-1 text-black font-medium">
                    {documentoPreview?.usuario?.nombre ? (
                      <>
                        <User className="h-3 w-3 text-blue-500" />
                        <span>{documentoPreview.usuario.nombre}</span>
                      </>
                    ) : (
                      "No disponible"
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center border rounded-md p-4 bg-white min-h-[300px]">
              {documentoPreview && (
                <>
                  {isImageFile(documentoPreview) ? (
                    <div className="flex flex-col items-center justify-center w-full">
                      <PreviewImage 
                        documento={documentoPreview} 
                        onDescargar={descargarDocumentoSeleccionado}
                      />
                    </div>
                  ) : isPdfFile(documentoPreview) ? (
                    <iframe 
                      src={`${getPreviewUrl(documentoPreview)}#toolbar=0`} 
                      className="w-full h-[500px]" 
                      title={documentoPreview.nombre_documentos}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8">
                      <FileText size={64} className="text-blue-500 mb-4" />
                      <p className="text-lg font-medium mb-2">Vista previa no disponible</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Este tipo de archivo no puede previsualizarse directamente.
                      </p>
                      <Button 
                        onClick={() => descargarDocumentoSeleccionado(documentoPreview.nombre_documentos)}
                        className="gap-2"
                      >
                        <Download size={16} />
                        Descargar para ver
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPreviewDialog(false)}
            >
              Cerrar
            </Button>
            <Button 
              onClick={() => {
                descargarDocumentoSeleccionado(documentoPreview?.nombre_documentos);
              }}
              className="gap-2"
            >
              <Download size={16} />
              Descargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente para previsualizar imágenes
const PreviewImage = ({ documento, onDescargar }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Referencia a la función descargarDocumentoSeleccionado del componente principal
  const handleDescargar = () => {
    onDescargar(documento.nombre_documentos);
  };

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const blob = await descargarDocumento(documento.nombre_documentos);
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando la imagen:", err);
        setError(true);
        setLoading(false);
      }
    };

    loadImage();

    // Limpiar URL al desmontar
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [documento]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-sm text-gray-500">Cargando imagen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mb-4">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p className="text-lg font-medium mb-2">Error al cargar la imagen</p>
        <p className="text-sm text-muted-foreground mb-4">
          No se pudo cargar la imagen. Intente descargarla.
        </p>
        <Button 
          onClick={handleDescargar}
          className="gap-2"
        >
          <Download size={16} />
          Descargar para ver
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <img 
        src={imageUrl} 
        alt={documento.nombre_documentos} 
        className="max-w-full max-h-[500px] object-contain"
      />
      <p className="text-sm text-muted-foreground mt-2">
        {documento.nombre_documentos}
      </p>
    </div>
  );
};

export default Documentos;
