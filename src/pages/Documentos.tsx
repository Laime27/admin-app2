import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Download, Eye, Upload, X, User } from "lucide-react";
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

// Tipo para los datos de usuario
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
}

// Tipo para los datos de documento
interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  tamaño: string;
  fechaCreacion: string;
  propietario: string;
  usuarioId?: number;
  descripcion?: string;
}

const Documentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("listado");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState<Partial<Documento>>({
    nombre: "",
    tipo: "",
    descripcion: "",
    usuarioId: undefined
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    // En un caso real, esto podría ser una llamada a una API
    // Por ahora, usamos los datos de ejemplo
    const usuariosData = [
      { id: 1, nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "Administrador", estado: "Activo" },
      { id: 2, nombre: "María López", email: "maria@ejemplo.com", rol: "Vendedor", estado: "Activo" },
      { id: 3, nombre: "Carlos Rodríguez", email: "carlos@ejemplo.com", rol: "Cajero", estado: "Inactivo" },
    ];
    setUsuarios(usuariosData);
  }, []);

  // Datos de ejemplo para la tabla de documentos
  const documentos = [
    { 
      id: 1, 
      nombre: "Contrato de servicios.pdf", 
      tipo: "PDF", 
      tamaño: "1.2 MB", 
      fechaCreacion: "2025-03-01", 
      propietario: "Juan Pérez",
      usuarioId: 1,
      descripcion: "Contrato de servicios legales para trámites migratorios"
    },
    { 
      id: 2, 
      nombre: "Formulario migratorio.docx", 
      tipo: "DOCX", 
      tamaño: "850 KB", 
      fechaCreacion: "2025-03-05", 
      propietario: "María López",
      usuarioId: 2,
      descripcion: "Formulario de solicitud para trámite migratorio"
    },
    { 
      id: 3, 
      nombre: "Pasaporte escaneado.jpg", 
      tipo: "JPG", 
      tamaño: "3.5 MB", 
      fechaCreacion: "2025-03-10", 
      propietario: "Carlos Rodríguez",
      usuarioId: 3,
      descripcion: "Copia digital del pasaporte para trámites"
    },
  ];

  // Filtrar documentos basados en el término de búsqueda
  const filteredDocumentos = documentos.filter(
    (documento) =>
      documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // Si se selecciona un usuario, actualizar también el propietario
    if (field === "usuarioId" && value) {
      const usuarioSeleccionado = usuarios.find(u => u.id === parseInt(value));
      if (usuarioSeleccionado) {
        setFormData(prev => ({
          ...prev,
          propietario: usuarioSeleccionado.nombre
        }));
      }
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
        tipo: fileExtension,
        tamaño: formatFileSize(file.size)
      }));
    }
  };

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Función para subir el documento
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !formData.usuarioId) {
      alert("Por favor, seleccione un archivo y un usuario");
      return;
    }
    
    // En un caso real, aquí se enviaría el archivo al servidor
    console.log("Documento a subir:", {
      ...formData,
      fechaCreacion: new Date().toISOString().split('T')[0]
    });
    
    // Limpiar el formulario
    setFormData({
      nombre: "",
      tipo: "",
      descripcion: "",
      usuarioId: undefined
    });
    setSelectedFile(null);
    setShowUploadDialog(false);
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
                <Label htmlFor="file">Seleccionar Archivo</Label>
                <Input 
                  id="file" 
                  type="file" 
                  onChange={handleFileChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usuarioId">Asignar a Usuario</Label>
                <Select 
                  value={formData.usuarioId?.toString() || ""} 
                  onValueChange={(value) => handleInputChange("usuarioId", parseInt(value))}
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
                        {documento.nombre}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                          {documento.tipo}
                        </span>
                      </TableCell>
                      <TableCell>{documento.tamaño}</TableCell>
                      <TableCell>{documento.fechaCreacion}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-blue-500" />
                          <span>{documento.propietario}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="Ver documento">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" title="Descargar documento">
                            <Download size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentos;
