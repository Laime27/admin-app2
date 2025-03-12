import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CrearProducto } from "@/servicios/productoServicio";
import { ListarCategorias } from "@/servicios/categoriaServicio";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  categoria_id: z.string().min(1, "La categoría es requerida"),
  nombre: z.string().min(1, "El nombre es requerido"),
  precio_unitario: z.string().min(1, "El precio unitario es requerido"),
  precio_compra: z.string().min(1, "El precio de compra es requerido"),
  descripcion: z.string().optional(),
  stock: z.string().min(1, "El stock es requerido"),
  stock_minimo: z.string().optional(),
  fecha_vencimiento: z.string().optional(),
  estado: z.enum(["Activo", "Inactivo"]),
  imagen: z.any().optional(),
});

interface Categoria {
  id: number;
  nombre: string;
}

const CrearProductoPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: "Activo",
    },
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const respuesta = await ListarCategorias();
      if (respuesta?.status === 200) {
        setCategorias(respuesta.data);
      }
    } catch (error) {
      mostrarError("Error al cargar las categorías");
    }
  };

  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    

    if (file) {
      if (file.type.startsWith('image/')) {
        
        form.setValue('imagen', file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenPreview(reader.result as string);
          
        };
        reader.readAsDataURL(file);
      } else {
        
        mostrarError("Por favor, selecciona un archivo de imagen válido");
        event.target.value = '';
        form.setValue('imagen', null);
        setImagenPreview(null);
      }
    } else {
   
      form.setValue('imagen', null);
      setImagenPreview(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setCargando(true);
      const formData = new FormData();
      
      // Agregar todos los campos al FormData
      formData.append('categoria_id', values.categoria_id);
      formData.append('nombre', values.nombre);
      formData.append('precio_unitario', String(Number(values.precio_unitario)));
      formData.append('precio_compra', String(Number(values.precio_compra)));
      if (values.descripcion) formData.append('descripcion', values.descripcion);
      formData.append('stock', String(Number(values.stock)));
      if (values.stock_minimo) formData.append('stock_minimo', String(Number(values.stock_minimo)));
      if (values.fecha_vencimiento) formData.append('fecha_vencimiento', values.fecha_vencimiento);
      formData.append('estado', values.estado);

      
      if(values.imagen instanceof File){
        formData.append('imagen', values.imagen, values.imagen.name);
      }

      const respuesta = await CrearProducto(formData);
      
      if (respuesta?.status === 201 || respuesta?.status === 200) {
        toast({
          title: "Éxito",
          description: "Producto creado correctamente",
        });
        navigate("/productos");
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      mostrarError("Error al crear el producto");
    } finally {
      setCargando(false);
    }
  };

  const mostrarError = (mensaje: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: mensaje,
    });
  };

  const renderFormField = (field: keyof z.infer<typeof formSchema>, label: string, type: string = "text", placeholder: string = "") => (
    <FormField
      control={form.control}
      name={field}
      render={({ field: fieldProps }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea placeholder={placeholder} {...fieldProps} />
            ) : type === "select" ? (
              <Select onValueChange={fieldProps.onChange} defaultValue={fieldProps.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field === "estado" ? (
                    <>
                      <SelectItem value="Activo">Activo</SelectItem>
                      <SelectItem value="Inactivo">Inactivo</SelectItem>
                    </>
                  ) : (
                    categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Input type={type} placeholder={placeholder} {...fieldProps} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campos requeridos */}
                {renderFormField("nombre", "Nombre *", "text", "Nombre del producto")}
                {renderFormField("categoria_id", "Categoría *", "select", "Selecciona una categoría")}
                {renderFormField("precio_unitario", "Precio Unitario *", "number", "0.00")}
                {renderFormField("precio_compra", "Precio de Compra *", "number", "0.00")}
                {renderFormField("stock", "Stock *", "number", "0")}
                {renderFormField("estado", "Estado *", "select", "Selecciona un estado")}

                {/* Campos opcionales */}
                {renderFormField("descripcion", "Descripción", "textarea", "Descripción del producto")}
                {renderFormField("stock_minimo", "Stock Mínimo", "number", "0")}
                {renderFormField("fecha_vencimiento", "Fecha de Vencimiento", "date")}

                <FormField
                  control={form.control}
                  name="imagen"
                  render={({ field: { value, ...field } }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Imagen del Producto</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            className="cursor-pointer"
                            {...field}
                          />
                          {imagenPreview && (
                            <div className="mt-2">
                              <img
                                src={imagenPreview}
                                alt="Vista previa"
                                className="max-w-[200px] h-auto rounded-lg border border-border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/productos")}
                  disabled={cargando}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={cargando}>
                  {cargando ? "Guardando..." : "Guardar Producto"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearProductoPage; 