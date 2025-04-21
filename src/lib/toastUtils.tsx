import { toast } from "@/components/ui/use-toast";

export const mostrarExito = (mensaje: string) => {
  toast({
    title: "Éxito",
    description: mensaje,
  });
};

export const mostrarError = (mensaje: string) => {
  toast({
    variant: "destructive",
    title: "Error",
    description: mensaje,
  });
};
