import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Clock,
  History,
  MapPin,
  User,
  Edit,
  FileText,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { listarCitas, historialCita , eliminarCita} from "@/servicios/citasServicio";
import { ListarUsuarios } from "@/servicios/usuarioServicio";
import {ListarCategorias } from "@/servicios/categoriaServicio";

import { Usuario } from "@/pages/usuarios/types";
import ModalVer from "./modalVer";
import ModalCrearActualizar from "./modalCrearActualizar";
import ModalHistorial from "./modalHistorial";
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
import { useToast } from "@/components/ui/use-toast";


export interface UsuarioCitas {
  id: number;
  usuario_id: number;
  fecha_cita: string;
  hora_cita: string;
  sede: string;
  nota: string;
  asunto: string;
  estado: string;
  created_at: Date;
  usuario: UsuarioClass;
}

export interface UsuarioClass {
  id: number;
  nombre: string;
  email: string;
}
interface Categoria {
  id: number;
  nombre: string;

}


const Citas = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [citaSeleccionada, setCitaSeleccionada] = useState<number | null>(null);
  
  const [citas, setCitas] = useState<UsuarioCitas[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<UsuarioCitas[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalCrearActualizarAbierto, setModalCrearActualizarAbierto] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [citaParaEditar, setCitaParaEditar] = useState<UsuarioCitas | null>(null);
  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
  const [historialCitas, setHistorialCitas] = useState<any[]>([]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);



  const listadoCitas = async () => {
    try {
      setIsLoading(true);
      const citasData = await listarCitas();
      setCitas(citasData);
      
    } catch (error) {
      console.error("Error al cargar citas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const usuariosData = await ListarUsuarios();
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const cargarCategorias = async() =>{
    try {
      const categoriasData = await ListarCategorias();
      setCategorias(categoriasData);
      console.log(categoriasData);
    } catch (error) {
      console.error("Error al cargar categorias:", error);
    }
  }

  useEffect(() => {
    cargarUsuarios();
    cargarCategorias();
    listadoCitas();

  }, []);

  useEffect(() => {
    const filtrarCitas = () => {
      const terminoBusqueda = searchTerm.toLowerCase();
      const citasFiltradas = citas.filter((cita) => 
        cita.usuario.nombre.toLowerCase().includes(terminoBusqueda) ||
        cita.asunto.toLowerCase().includes(terminoBusqueda) ||
        cita.sede.toLowerCase().includes(terminoBusqueda) ||
        cita.fecha_cita.toLowerCase().includes(terminoBusqueda) ||
        cita.estado.toLowerCase().includes(terminoBusqueda)
      );
      setCitasFiltradas(citasFiltradas);
    };

    filtrarCitas();

  }, [searchTerm, citas]);
  


  const handleVerResumen =  (id: number) => {
      setCitaSeleccionada(id);
      setModalVerAbierto(true);
      
  };

  const handleEditCita = async (id: number) => {
    const citaToEdit = citas.find(cita => cita.id === id);

    if (citaToEdit) {
      setCitaParaEditar(citaToEdit);
      console.log(citaToEdit);
      setModalCrearActualizarAbierto(true);
    }
  };

  const handleShowHistorial = async (id: number) => {
    try {
      const historial = await historialCita(id);
      console.log(historial);
      setHistorialCitas(historial);
      console.log(historialCitas);
      setModalHistorialAbierto(true);
    } catch (error) {
      console.error("Error al cargar el historial:", error);
    }
  };

  const handleSaveCita = async (formData: any) => {
    try {
      await listadoCitas();
      setModalCrearActualizarAbierto(false);
      setCitaParaEditar(null);
    } catch (error) {
      console.error("Error al guardar la cita:", error);
    }
  };


  const manejarConfirmarEliminar = async (id) => {
     
        try {
     
         const respuesta = await eliminarCita(id);

          await listadoCitas();
  
          setModalEliminarAbierto(false);

        } catch (error) {
        
        } finally {
         
        }
   
    };


  const renderizarModalEliminar = (id) => (
    <AlertDialog open={modalEliminarAbierto} onOpenChange={setModalEliminarAbierto}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la cita 
        
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel >Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={() => manejarConfirmarEliminar(id)}

          >
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (

   


    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Citas</h1>
        <Button 
          className="flex items-center gap-2"
          onClick={() => {
            setCitaParaEditar(null);
            setModalCrearActualizarAbierto(true);
          }}
        >
          <Plus size={16} />
          <span>Nueva Cita</span>
        </Button>
      </div>

      <ModalVer
        id={citaSeleccionada ?? 1}
        isOpen={modalVerAbierto}
        onClose={() => setModalVerAbierto(false)}
      />

      <ModalCrearActualizar
        isOpen={modalCrearActualizarAbierto}
        onClose={() => {
          setModalCrearActualizarAbierto(false);
          setCitaParaEditar(null);
        }}
        onSave={handleSaveCita}
        citaToEdit={citaParaEditar}
        usuarios={usuarios}
        categorias={categorias}
      />

      <ModalHistorial
        isOpen={modalHistorialAbierto}
        onClose={() => setModalHistorialAbierto(false)}
        historial={historialCitas}
      />

      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <CalendarIcon size={20} />
            <span>Calendario de Citas</span>
          </CardTitle>
          <CardDescription>
            Gestione las citas migratorias de sus clientes en las diferentes
            sedes.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar citas..."
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Asunto</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {citasFiltradas.length > 0 ? (
                  citasFiltradas.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell>{cita.id}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <User size={14} className="text-blue-500" />
                        {cita.usuario.nombre}
                      </TableCell>
                      <TableCell>{cita.fecha_cita}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock size={14} />
                        {cita.hora_cita}
                      </TableCell>
                      <TableCell>{cita.asunto}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <MapPin size={14} className="text-red-500" />
                        {cita.sede}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            cita.estado === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : cita.estado === "Confirmada"
                              ? "bg-blue-100 text-blue-800"
                              : cita.estado === "Cancelada"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {cita.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1"
                            onClick={() => handleVerResumen(cita.id)}
                          >
                            <FileText className="h-4 w-4" />
                            <span>Ver</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-1"
                            onClick={() => handleEditCita(cita.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span>Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-1"
                            onClick={() => handleShowHistorial(cita.id)}
                          >
                            <History className="h-4 w-4" />
                            <span>Historial</span>
                          </Button>

                          <Button
                          size="icon"
                          variant="ghost"
                          className="w-7 h-7 bg-red-500/20 text-red-500 hover:bg-red-500/30"
                          onClick={() => renderizarModalEliminar(cita.id)}
                          
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {isLoading
                        ? "Cargando citas..."
                        : "No se encontraron citas."}
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

export default Citas;
