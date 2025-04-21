import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plane, 
  Plus, 
  Search, 
  FileCheck, 
  User,
  CheckCircle2,
  AlertCircle,
  Trash2,

} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FormularioMigracion from "./FormularioMigracion";
import { ListarUsuarios } from "@/servicios/usuarioServicio";
import { ListarProcesos, CrearProceso, ActualizarProceso, EliminarProceso } from "@/servicios/migracionesServicio";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mostrarExito, mostrarError } from "@/lib/toastUtils";

// Interfaces
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
}

interface ClienteMigracion {
  id: number;
  usuario_id: number;
  usuarioNombre?: string;
  fecha_audiencia: string | null;
  dias_corte: number | null;
  fecha_envio_asilo: string | null;
  fecha_permiso_trabajo: string | null;
  estado_caso: string;
  estado_asilo: string;
  fecha_cumple_asilo: string | null;
  nota: string;
}

const Migraciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormulario, setShowFormulario] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteMigracion | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clientes, setClientes] = useState<ClienteMigracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);


  const cargarDatos = async () => {
    try {
      const [usuariosData, procesosData] = await Promise.all([
        ListarUsuarios(),
        ListarProcesos()
      ]);
      
      setUsuarios(usuariosData);
      
      // Agregar nombre de usuario a cada proceso
      const procesosConUsuarios = procesosData.map((proceso: ClienteMigracion) => {
        const usuario = usuariosData.find((u: Usuario) => u.id === proceso.usuario_id);
        return {
          ...proceso,
          usuarioNombre: usuario?.nombre
        };
      });
      
      setClientes(procesosConUsuarios);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios y procesos
  useEffect(() => {
   

    cargarDatos();
  }, []);

  // Filtrar clientes basados en el término de búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      (cliente.usuarioNombre && cliente.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cliente.estado_caso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para editar un cliente
  const handleEditCliente = (cliente: ClienteMigracion) => {
    setSelectedCliente(cliente);
    setShowFormulario(true);
  };

  // Función para crear un nuevo cliente
  const handleNewCliente = () => {
    setSelectedCliente(null);
    setShowFormulario(true);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (data: Partial<ClienteMigracion>) => {
    try {
      if (selectedCliente) {
        // Actualizar
        await ActualizarProceso(selectedCliente.id, data);
        mostrarExito("Proceso actualizado exitosamente");
      } else {
        // Crear
        await CrearProceso(data as ClienteMigracion);
        mostrarExito("Proceso creado exitosamente");
      }
      
      // Recargar la lista
      const procesosData = await ListarProcesos();
      const procesosConUsuarios = procesosData.map((proceso: ClienteMigracion) => {
        const usuario = usuarios.find(u => u.id === proceso.usuario_id);
        return {
          ...proceso,
          usuarioNombre: usuario?.nombre
        };
      });
      setClientes(procesosConUsuarios);
      
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Error al guardar los datos");
    }
    
    setShowFormulario(false);
    setSelectedCliente(null);
  };

  // Renderizar el estado con un badge de color
  const renderEstado = (estado: string) => {
    let className = "";
    switch (estado.toLowerCase()) {
      case "completado":
        className = "bg-green-100 text-green-800";
        break;
      case "en proceso":
        className = "bg-blue-100 text-blue-800";
        break;
      case "urgente":
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

  const manejarEliminar = async (id) => {
    try {
      await EliminarProceso(id);
      mostrarExito("Proceso eliminado exitosamente");
      cargarDatos();
    }
    catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar el proceso");
    }
  };

  const manejarConfirmarEliminar = async () => {
    if (!idAEliminar) return;
  
    await manejarEliminar(idAEliminar);
    setModalEliminarAbierto(false);
    setIdAEliminar(null); 
  };
  
  

    const renderizarModalEliminar = (id) => {
      setIdAEliminar(id);
      setModalEliminarAbierto(true);
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

      <AlertDialog open={modalEliminarAbierto} onOpenChange={setModalEliminarAbierto}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la cita
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={manejarConfirmarEliminar}
              >
                Eliminar
              </AlertDialogAction>

            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

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
                  <TableHead>Usuario Asignado</TableHead>
                  <TableHead>Audiencia</TableHead>
                  <TableHead>Asilo</TableHead>
                  <TableHead>Permiso de Trabajo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
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
                        {cliente.fecha_audiencia ? (
                          <div className="flex flex-col">
                            <span>{new Date(cliente.fecha_audiencia).toLocaleDateString()}</span>
                            <span className="text-xs text-muted-foreground">
                              {cliente.dias_corte} días en corte
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No asignada</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {cliente.estado_asilo === 'Sometido' ? (
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              <span className="text-sm">Sometido</span>
                            </span>
                            {cliente.fecha_cumple_asilo && (
                              <span className="text-xs text-muted-foreground">
                                Cumple año: {new Date(cliente.fecha_cumple_asilo).toLocaleDateString()}
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
                        {cliente.fecha_permiso_trabajo ? (
                          <span>{new Date(cliente.fecha_permiso_trabajo).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">No disponible</span>
                        )}
                      </TableCell>
                      <TableCell>{renderEstado(cliente.estado_caso)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditCliente(cliente)}
                          >
                            Editar
                          </Button>
                         
                           <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7 bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              onClick={() => renderizarModalEliminar(cliente.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      no hay migraciones...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <FormularioMigracion
        isOpen={showFormulario}
        onClose={() => setShowFormulario(false)}
        onSubmit={handleSubmit}
        clienteSeleccionado={selectedCliente}
        usuarios={usuarios}
      />
    </div>
  );
};

export default Migraciones;
