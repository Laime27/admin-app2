import { Laptop, Monitor, Keyboard, MousePointer, Headphones, Tablet, Printer, HardDrive, Video, Speaker } from "lucide-react";

interface ProductImageProps {
  type: string;
  className?: string;
}

const ProductImage = ({ type, className = "" }: ProductImageProps) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case "laptop":
        return <Laptop className="w-4 h-4 text-white" />;
      case "monitor":
        return <Monitor className="w-4 h-4 text-white" />;
      case "teclado":
        return <Keyboard className="w-4 h-4 text-white" />;
      case "mouse":
        return <MousePointer className="w-4 h-4 text-white" />;
      case "auriculares":
        return <Headphones className="w-4 h-4 text-white" />;
      case "tablet":
        return <Tablet className="w-4 h-4 text-white" />;
      case "impresora":
        return <Printer className="w-4 h-4 text-white" />;
      case "disco":
        return <HardDrive className="w-4 h-4 text-white" />;
      case "camara":
        return <Video className="w-4 h-4 text-white" />;
      case "altavoces":
        return <Speaker className="w-4 h-4 text-white" />;
      default:
        return <div className="w-4 h-4 text-white">{type.substring(0, 1)}</div>;
    }
  };

  return (
    <div className={`w-8 h-8 bg-secondary/50 rounded-md flex items-center justify-center ${className}`}>
      {getIcon()}
    </div>
  );
};

export default ProductImage; 