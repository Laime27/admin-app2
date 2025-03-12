import React from 'react';

interface ProductoCardProps {
  nombre: string;
  precio: number;
  imagen: string;
  onClick: () => void;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ nombre, precio, imagen, onClick }) => {
  // Función para manejar errores de carga de imágenes
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.style.display = 'none';
    
    // Mostrar la primera letra del nombre como fallback
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add('flex', 'items-center', 'justify-center');
      const textNode = document.createElement('span');
      textNode.textContent = nombre.charAt(0);
      textNode.className = 'text-2xl font-medium text-white';
      parent.appendChild(textNode);
    }
  };

  return (
    <div 
      className="bg-card rounded-lg p-3 cursor-pointer hover:bg-secondary/10 transition-colors"
      onClick={onClick}
    >
      <div className="w-full h-32 bg-secondary/20 rounded-md flex items-center justify-center mb-2 overflow-hidden">
        <img 
          src={`/images/${imagen}.jpg`} 
          alt={nombre}
          className="w-full h-full object-cover rounded-md"
          onError={handleImageError}
        />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-white">{nombre}</h3>
        <p className="text-sm text-white mt-1">${precio.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductoCard; 