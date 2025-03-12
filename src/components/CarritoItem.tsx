import { Minus, Plus, Trash2 } from "lucide-react";
import { Producto } from "@/types/producto";

interface CarritoItemProps {
  producto: Producto;
  cantidad: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CarritoItem = ({ producto, cantidad, onIncrement, onDecrement, onRemove }: CarritoItemProps) => {
  const subtotal = producto.precio * cantidad;

  return (
    <div className="py-2 border-b border-secondary/20 last:border-0">
      <div className="flex justify-between items-start mb-1">
        <span className="text-sm font-medium text-white">{producto.nombre}</span>
        <span className="text-sm font-medium text-white">${subtotal.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-xs text-blue-400">${producto.precio.toFixed(2)} x {cantidad}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {cantidad === 1 ? (
            <button 
              onClick={onRemove}
              className="text-red-500 hover:text-red-400 transition-colors"
              aria-label="Eliminar producto"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button 
              onClick={onDecrement}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus size={16} />
            </button>
          )}
          
          <button 
            onClick={onIncrement}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoItem; 