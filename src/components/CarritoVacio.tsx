import { ShoppingCart } from "lucide-react";

const CarritoVacio = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ShoppingCart className="w-16 h-16 text-gray-500 mb-3" strokeWidth={1.5} />
      <p className="text-gray-400">El carrito está vacío</p>
    </div>
  );
};

export default CarritoVacio; 