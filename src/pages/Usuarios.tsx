import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Eye, Edit, User, Gift } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showReferidosModal, setShowReferidosModal] = useState(false);

  // Datos de ejemplo para la tabla de usuarios
  const usuarios = [
    { 
      id: 1, 
      nombre: "Juan Pérez", 
      email: "juan@ejemplo.com", 
      celular: "+58 412-123-4567", 
      estado: "Activo",
      codigoReferidos: "JUAN2023",
      cantidadReferidos: 8,
      referidos: [
        { nombre: "Ana Martínez", email: "ana@ejemplo.com", fecha: "15/02/2025" },
        { nombre: "Luis Sánchez", email: "luis@ejemplo.com", fecha: "20/02/2025" },
        { nombre: "Elena Gómez", email: "elena@ejemplo.com", fecha: "25/02/2025" },
        { nombre: "Pedro Ramírez", email: "pedro@ejemplo.com", fecha: "01/03/2025" },
        { nombre: "Sofía Torres", email: "sofia@ejemplo.com", fecha: "05/03/2025" },
        { nombre: "Miguel Díaz", email: "miguel@ejemplo.com", fecha: "08/03/2025" },
        { nombre: "Laura Fernández", email: "laura@ejemplo.com", fecha: "10/03/2025" },
        { nombre: "Roberto Castro", email: "roberto@ejemplo.com", fecha: "11/03/2025" }
      ]
    },
    { 
      id: 2, 
      nombre: "María López", 
      email: "maria@ejemplo.com", 
      celular: "+58 414-987-6543", 
      estado: "Activo",
      codigoReferidos: "MARIA2023",
      cantidadReferidos: 5,
      referidos: [
        { nombre: "Carlos Mendoza", email: "carlos.m@ejemplo.com", fecha: "02/03/2025" },
        { nombre: "Diana Pérez", email: "diana@ejemplo.com", fecha: "05/03/2025" },
        { nombre: "Fernando Ruiz", email: "fernando@ejemplo.com", fecha: "07/03/2025" },
        { nombre: "Gabriela Vega", email: "gabriela@ejemplo.com", fecha: "09/03/2025" },
        { nombre: "Héctor Morales", email: "hector@ejemplo.com", fecha: "10/03/2025" }
      ]
    },
    { 
      id: 3, 
      nombre: "Carlos Rodríguez", 
      email: "carlos@ejemplo.com", 
      celular: "+58 424-555-7890", 
      estado: "Inactivo",
      codigoReferidos: "CARLOS2023",
      cantidadReferidos: 0,
      referidos: []
    },
  ];

  // Función para abrir el modal de referidos
  const handleVerReferidos = (usuario: any) => {
    setSelectedUser(usuario);
    setShowReferidosModal(true);
  };

  // Filtrar usuarios basados en el término de búsqueda
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.celular.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.codigoReferidos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nuevo Usuario</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Users size={20} />
            <span>Usuarios del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuarios..."
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Código de referidos</TableHead>
                  <TableHead>Cantidad de referidos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.celular}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {usuario.codigoReferidos}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{usuario.cantidadReferidos}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            usuario.estado === "Activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {usuario.estado}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleVerReferidos(usuario)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Ver</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Editar</span>
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

      {/* Modal de Referidos */}
      <Dialog open={showReferidosModal} onOpenChange={setShowReferidosModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5" /> 
              Información de Referidos
            </DialogTitle>
            <DialogDescription>
              Resumen de referidos para {selectedUser?.nombre}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Información del usuario y código */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Usuario</h3>
                <p className="text-base font-medium">{selectedUser?.nombre}</p>
                <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Código de Referido</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-sm">
                    {selectedUser?.codigoReferidos}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Resumen de referidos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span>Referidos ({selectedUser?.cantidadReferidos})</span>
                </h3>
              </div>
              
              {selectedUser?.cantidadReferidos > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Fecha de Registro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUser?.referidos.map((referido: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{referido.nombre}</TableCell>
                          <TableCell>{referido.email}</TableCell>
                          <TableCell>{referido.fecha}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/10">
                  <Users className="h-10 w-10 text-muted-foreground mb-3" />
                  <h4 className="text-lg font-medium">Sin referidos</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Este usuario aún no tiene referidos registrados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Usuarios;
