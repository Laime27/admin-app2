import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plane, 
  Plus, 
  Search, 
  FileCheck, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  User,
  CalendarDays,
  FileText,
  BriefcaseBusiness,
  X
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Tipo para los datos de usuario
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
}

// Tipo para los datos de migración
interface ClienteMigracion {
  id: number;
  nombre: string;
  usuarioId?: number; // ID del usuario asociado
  usuarioNombre?: string; // Nombre del usuario asociado
  fechaAudiencia: string | null;
  diasCorte: number | null;
  fechaEnvioAsilo: string | null;
  fechaSolicitudTrabajoPermitida: string | null;
  tieneAsiloSometido: boolean;
  fechaCumpleAnioAsilo: string | null;
  proximasCitas: {
    fecha: string;
    descripcion: string;
    diasRestantes: number;
  }[];
  notas: string;
  estado: "Pendiente" | "En Proceso" | "Completado" | "Urgente";
}

const Migraciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("listado");
  const [formData, setFormData] = useState<Partial<ClienteMigracion>>({
    nombre: "",
    usuarioId: undefined,
    usuarioNombre: "",
    fechaAudiencia: null,
    diasCorte: null,
    fechaEnvioAsilo: null,
    fechaSolicitudTrabajoPermitida: null,
    tieneAsiloSometido: false,
    fechaCumpleAnioAsilo: null,
    proximasCitas: [],
    notas: "",
    estado: "Pendiente"
  });
  const [selectedCliente, setSelectedCliente] = useState<ClienteMigracion | null>(null);
  const [showNuevaCitaDialog, setShowNuevaCitaDialog] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({ fecha: "", descripcion: "" });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    // En un caso real, esto podría ser una llamada a una API
    // Por ahora, usamos los datos de ejemplo de Usuarios.tsx
    const usuariosData = [
      { id: 1, nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "Administrador", estado: "Activo" },
      { id: 2, nombre: "María López", email: "maria@ejemplo.com", rol: "Vendedor", estado: "Activo" },
      { id: 3, nombre: "Carlos Rodríguez", email: "carlos@ejemplo.com", rol: "Cajero", estado: "Inactivo" },
    ];
    setUsuarios(usuariosData);
  }, []);

  // Datos de ejemplo para la tabla de migraciones
  const clientes: ClienteMigracion[] = [
    { 
      id: 1, 
      nombre: "Juan Pérez", 
      usuarioId: 1,
      usuarioNombre: "Juan Pérez",
      fechaAudiencia: "2025-05-15",
      diasCorte: 3,
      fechaEnvioAsilo: "2024-11-10",
      fechaSolicitudTrabajoPermitida: "2025-05-10",
      tieneAsiloSometido: true,
      fechaCumpleAnioAsilo: "2025-11-10",
      proximasCitas: [
        { fecha: "2025-04-05", descripcion: "Entrega de documentos", diasRestantes: 25 },
        { fecha: "2025-06-20", descripcion: "Audiencia preliminar", diasRestantes: 101 }
      ],
      notas: "Cliente con caso prioritario. Necesita asistencia con traducción de documentos.",
      estado: "En Proceso"
    },
    { 
      id: 2, 
      nombre: "María López", 
      usuarioId: 2,
      usuarioNombre: "María López",
      fechaAudiencia: "2025-04-20",
      diasCorte: 1,
      fechaEnvioAsilo: "2024-08-15",
      fechaSolicitudTrabajoPermitida: "2025-02-15",
      tieneAsiloSometido: true,
      fechaCumpleAnioAsilo: "2025-08-15",
      proximasCitas: [
        { fecha: "2025-03-30", descripcion: "Preparación para audiencia", diasRestantes: 19 }
      ],
      notas: "Caso con necesidad de asesoría legal especializada.",
      estado: "Urgente"
    },
    { 
      id: 3, 
      nombre: "Carlos Rodríguez", 
      usuarioId: 3,
      usuarioNombre: "Carlos Rodríguez",
      fechaAudiencia: "2025-07-10",
      diasCorte: 2,
      fechaEnvioAsilo: "2025-01-05",
      fechaSolicitudTrabajoPermitida: "2025-07-05",
      tieneAsiloSometido: false,
      fechaCumpleAnioAsilo: null,
      proximasCitas: [
        { fecha: "2025-05-15", descripcion: "Consulta inicial", diasRestantes: 65 }
      ],
      notas: "Pendiente de entrega de documentos adicionales.",
      estado: "Pendiente"
    },
  ];

  // Filtrar clientes basados en el término de búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.estado && cliente.estado.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cliente.usuarioNombre && cliente.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });

    // Si se selecciona un usuario, actualizar también el nombre del cliente
    if (field === "usuarioId" && value) {
      const usuarioSeleccionado = usuarios.find(u => u.id === parseInt(value));
      if (usuarioSeleccionado) {
        setFormData(prev => ({
          ...prev,
          usuarioNombre: usuarioSeleccionado.nombre,
          nombre: usuarioSeleccionado.nombre // Opcional: Actualizar también el nombre del cliente
        }));
      }
    }
  };

  // Función para agregar una nueva cita
  const handleAddCita = () => {
    if (!nuevaCita.fecha || !nuevaCita.descripcion) return;
    
    const hoy = new Date();
    const fechaCita = new Date(nuevaCita.fecha);
    const diasRestantes = Math.ceil((fechaCita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    const nuevasCitas = [
      ...(formData.proximasCitas || []),
      {
        fecha: nuevaCita.fecha,
        descripcion: nuevaCita.descripcion,
        diasRestantes
      }
    ];
    
    setFormData({
      ...formData,
      proximasCitas: nuevasCitas
    });
    
    setNuevaCita({ fecha: "", descripcion: "" });
    setShowNuevaCitaDialog(false);
  };

  // Función para eliminar una cita
  const handleRemoveCita = (index: number) => {
    const nuevasCitas = [...(formData.proximasCitas || [])];
    nuevasCitas.splice(index, 1);
    setFormData({
      ...formData,
      proximasCitas: nuevasCitas
    });
  };

  // Función para guardar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);
    // Aquí iría la lógica para guardar en la base de datos
    setActiveTab("listado");
  };

  // Función para editar un cliente
  const handleEditCliente = (cliente: ClienteMigracion) => {
    setSelectedCliente(cliente);
    setFormData(cliente);
    setActiveTab("formulario");
  };

  // Función para crear un nuevo cliente
  const handleNewCliente = () => {
    setSelectedCliente(null);
    setFormData({
      nombre: "",
      usuarioId: undefined,
      usuarioNombre: "",
      fechaAudiencia: null,
      diasCorte: null,
      fechaEnvioAsilo: null,
      fechaSolicitudTrabajoPermitida: null,
      tieneAsiloSometido: false,
      fechaCumpleAnioAsilo: null,
      proximasCitas: [],
      notas: "",
      estado: "Pendiente"
    });
    setActiveTab("formulario");
  };

  // Renderizar el estado con un badge de color
  const renderEstado = (estado: string) => {
    let className = "";
    switch (estado) {
      case "Completado":
        className = "bg-green-100 text-green-800";
        break;
      case "En Proceso":
        className = "bg-blue-100 text-blue-800";
        break;
      case "Urgente":
        className = "bg-red-100 text-red-800";
        break;
      default:
        className = "bg-yellow-100 text-yellow-800";
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
        {estado}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Migraciones</h1>
        <Button className="flex items-center gap-2" onClick={handleNewCliente}>
          <Plus size={16} />
          <span>Nuevo Cliente</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listado">Listado de Clientes</TabsTrigger>
          <TabsTrigger value="formulario">Formulario de Datos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listado">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Plane size={20} />
                <span>Clientes y Trámites Migratorios</span>
              </CardTitle>
              <CardDescription>
                Gestione la información migratoria de sus clientes, audiencias y plazos importantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar clientes..."
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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Usuario Asignado</TableHead>
                      <TableHead>Audiencia</TableHead>
                      <TableHead>Asilo</TableHead>
                      <TableHead>Permiso de Trabajo</TableHead>
                      <TableHead>Próxima Cita</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClientes.length > 0 ? (
                      filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell className="font-medium">{cliente.nombre}</TableCell>
                          <TableCell>
                            {cliente.usuarioNombre ? (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3 text-blue-500" />
                                <span>{cliente.usuarioNombre}</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-sm">No asignado</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {cliente.fechaAudiencia ? (
                              <div className="flex flex-col">
                                <span>{new Date(cliente.fechaAudiencia).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">
                                  {cliente.diasCorte} días en corte
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No asignada</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {cliente.tieneAsiloSometido ? (
                              <div className="flex flex-col">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  <span className="text-sm">Sometido</span>
                                </span>
                                {cliente.fechaCumpleAnioAsilo && (
                                  <span className="text-xs text-muted-foreground">
                                    Cumple año: {new Date(cliente.fechaCumpleAnioAsilo).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 text-yellow-500" />
                                <span className="text-sm">Pendiente</span>
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {cliente.fechaSolicitudTrabajoPermitida ? (
                              <span>{new Date(cliente.fechaSolicitudTrabajoPermitida).toLocaleDateString()}</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">No disponible</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {cliente.proximasCitas && cliente.proximasCitas.length > 0 ? (
                              <div className="flex flex-col">
                                <span>{new Date(cliente.proximasCitas[0].fecha).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">
                                  {cliente.proximasCitas[0].descripcion}
                                </span>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {cliente.proximasCitas[0].diasRestantes} días
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Sin citas</span>
                            )}
                          </TableCell>
                          <TableCell>{renderEstado(cliente.estado)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditCliente(cliente)}
                              >
                                Editar
                              </Button>
                              <Button variant="ghost" size="icon">
                                <FileCheck size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No se encontraron resultados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="formulario">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <User size={20} />
                <span>
                  {selectedCliente ? `Editar Cliente: ${selectedCliente.nombre}` : "Nuevo Cliente"}
                </span>
              </CardTitle>
              <CardDescription>
                Complete la información migratoria del cliente, incluyendo audiencias, citas y plazos importantes.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información básica del cliente */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="usuarioId">Seleccionar Usuario</Label>
                      <Select 
                        value={formData.usuarioId?.toString() || ""} 
                        onValueChange={(value) => handleInputChange("usuarioId", parseInt(value))}
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
                        El usuario seleccionado será asociado a este trámite migratorio
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="nombre">Nombre del Cliente</Label>
                      <Input 
                        id="nombre" 
                        value={formData.nombre || ""} 
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Nombre completo"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="estado">Estado del Caso</Label>
                      <Select 
                        value={formData.estado} 
                        onValueChange={(value) => handleInputChange("estado", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendiente">Pendiente</SelectItem>
                          <SelectItem value="En Proceso">En Proceso</SelectItem>
                          <SelectItem value="Completado">Completado</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notas">Notas Adicionales</Label>
                      <Textarea 
                        id="notas" 
                        value={formData.notas || ""} 
                        onChange={(e) => handleInputChange("notas", e.target.value)}
                        placeholder="Información adicional relevante para el caso"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  {/* Información de audiencias y fechas */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="fechaAudiencia">Fecha de Audiencia</Label>
                        <Input 
                          id="fechaAudiencia" 
                          type="date" 
                          value={formData.fechaAudiencia || ""} 
                          onChange={(e) => handleInputChange("fechaAudiencia", e.target.value)}
                        />
                      </div>
                      <div className="w-1/3">
                        <Label htmlFor="diasCorte">Días en Corte</Label>
                        <Input 
                          id="diasCorte" 
                          type="number" 
                          min="0"
                          value={formData.diasCorte || ""} 
                          onChange={(e) => handleInputChange("diasCorte", parseInt(e.target.value) || null)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="fechaEnvioAsilo">Fecha de Envío del Asilo</Label>
                      <Input 
                        id="fechaEnvioAsilo" 
                        type="date" 
                        value={formData.fechaEnvioAsilo || ""} 
                        onChange={(e) => handleInputChange("fechaEnvioAsilo", e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label htmlFor="tieneAsiloSometido">Estado del Asilo</Label>
                        <Select 
                          value={formData.tieneAsiloSometido ? "true" : "false"} 
                          onValueChange={(value) => handleInputChange("tieneAsiloSometido", value === "true")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Estado del asilo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Sometido</SelectItem>
                            <SelectItem value="false">Pendiente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formData.tieneAsiloSometido && (
                        <div className="flex-1">
                          <Label htmlFor="fechaCumpleAnioAsilo">Fecha Cumple Año Asilo</Label>
                          <Input 
                            id="fechaCumpleAnioAsilo" 
                            type="date" 
                            value={formData.fechaCumpleAnioAsilo || ""} 
                            onChange={(e) => handleInputChange("fechaCumpleAnioAsilo", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="fechaSolicitudTrabajoPermitida">Fecha para Solicitar Permiso de Trabajo</Label>
                      <Input 
                        id="fechaSolicitudTrabajoPermitida" 
                        type="date" 
                        value={formData.fechaSolicitudTrabajoPermitida || ""} 
                        onChange={(e) => handleInputChange("fechaSolicitudTrabajoPermitida", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sección de citas */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Citas Migratorias</Label>
                    <Dialog open={showNuevaCitaDialog} onOpenChange={setShowNuevaCitaDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Plus size={14} />
                          <span>Agregar Cita</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Nueva Cita</DialogTitle>
                          <DialogDescription>
                            Ingrese los detalles de la nueva cita migratoria para este cliente.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="citaFecha">Fecha de la Cita</Label>
                            <Input 
                              id="citaFecha" 
                              type="date" 
                              value={nuevaCita.fecha} 
                              onChange={(e) => setNuevaCita({...nuevaCita, fecha: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="citaDescripcion">Descripción</Label>
                            <Input 
                              id="citaDescripcion" 
                              value={nuevaCita.descripcion} 
                              onChange={(e) => setNuevaCita({...nuevaCita, descripcion: e.target.value})}
                              placeholder="Ej: Entrega de documentos, audiencia, etc."
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowNuevaCitaDialog(false)}>Cancelar</Button>
                          <Button onClick={handleAddCita}>Agregar</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {formData.proximasCitas && formData.proximasCitas.length > 0 ? (
                    <div className="space-y-2">
                      {formData.proximasCitas.map((cita, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{cita.descripcion}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(cita.fecha).toLocaleDateString()} 
                                <span className="ml-2 text-xs">
                                  ({cita.diasRestantes} días restantes)
                                </span>
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveCita(index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-muted/20">
                      <p className="text-muted-foreground">No hay citas programadas</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("listado")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Información</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Migraciones;
