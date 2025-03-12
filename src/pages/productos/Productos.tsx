import { Search, Plus, Pencil, Trash2, MoreVertical, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductImage from "@/components/ProductImage";
import { ListarProductos, EliminarProducto, Producto } from "@/servicios/productoServicio";
import { useToast } from "@/components/ui/use-toast";
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

const Productos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const respuesta = await ListarProductos();
      if (respuesta?.status === 200) {
        setProductos(respuesta.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los productos",
      });
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (producto: Producto) => {
    navigate(`/productos/editar/${producto.id}`);
  };

  const handleEliminar = async () => {
    if (!productoAEliminar) return;

    try {
      setCargando(true);
      const respuesta = await EliminarProducto(productoAEliminar.id!);
      if (respuesta.status === 204) {
        toast({
          title: "Éxito",
          description: "Producto eliminado correctamente",
        });
        await cargarProductos();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el producto",
      });
    } finally {
      setCargando(false);
      setProductoAEliminar(null);
    }
  };

  // Filtrar productos basado en la búsqueda
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (producto.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Componentes de renderizado
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Productos</h1>
        <p className="text-gray-400 text-sm">Gestiona tu inventario de productos</p>
      </div>
      <button 
        onClick={() => navigate("/productos/crear")}
        className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-md flex items-center justify-center sm:justify-start gap-2 text-sm font-medium"
      >
        <Plus size={16} />
        <span>Crear Producto</span>
      </button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-3 py-2 rounded-md bg-secondary/30 border border-secondary text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );

  const renderTableHeader = () => (
    <thead>
      <tr className="border-t border-b border-secondary/20">
        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Imagen</th>
        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Nombre</th>
        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 hidden md:table-cell">Precio</th>
        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 hidden md:table-cell">Stock</th>
        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Estado</th>
        <th className="text-left py-3 px-4 text-xs font-medium text-gray-400">Acciones</th>
      </tr>
    </thead>
  );

  const renderProductRow = (producto: Producto) => (
    <tr key={producto.id} className="border-b border-secondary/20 hover:bg-secondary/10">
      <td className="py-3 px-4">
        {producto.imagen ? (
          <img 
            src={`${producto.imagen_url}`}
            alt={producto.nombre}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : (
          <ProductImage type="default" />
        )}
      </td>
      <td className="py-3 px-4">
        <div>
          <p className="text-sm font-medium text-white">{producto.nombre}</p>
          <p className="text-xs text-gray-400 hidden sm:block">{producto.descripcion}</p>
          <div className="flex items-center gap-2 mt-1 sm:hidden">
            <span className="text-xs text-white">${Number(producto.precio_unitario).toFixed(2)}</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-white">Stock: {producto.stock}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <span className="text-sm text-white">${Number(producto.precio_unitario).toFixed(2)}</span>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <span className={`text-sm ${producto.stock_minimo && producto.stock <= producto.stock_minimo ? 'text-yellow-500' : 'text-white'}`}>
          {producto.stock}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-block text-xs px-2 py-1 rounded-full 
        ${ producto.estado === "Activo"
            ? "bg-green-500/20 text-green-500 border border-green-500" 
            : "bg-red-500/20 text-red-500 border border-red-500"
        }`}>
          {producto.estado}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditar(producto)}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
            disabled={cargando}
          >
            <Pencil size={16} className="text-blue-500" />
          </button>
          <button
            onClick={() => setProductoAEliminar(producto)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            disabled={cargando}
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        {renderTableHeader()}
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                Cargando productos...
              </td>
            </tr>
          ) : filteredProductos.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                No se encontraron productos
              </td>
            </tr>
          ) : (
            filteredProductos.map(renderProductRow)
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDeleteDialog = () => (
    <AlertDialog open={!!productoAEliminar} onOpenChange={() => setProductoAEliminar(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el producto
            "{productoAEliminar?.nombre}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cargando}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEliminar}
            disabled={cargando}
            className="bg-red-500 hover:bg-red-600"
          >
            {cargando ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Renderizado principal
  return (
    <div className="p-4 md:p-6">
      {renderHeader()}
      
      <div className="bg-card rounded-lg border border-secondary/20 overflow-hidden mb-6">
        <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          {renderSearchBar()}
        </div>
        {renderTable()}
      </div>

      {renderDeleteDialog()}
    </div>
  );
};

export default Productos;
