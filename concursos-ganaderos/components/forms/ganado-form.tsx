"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { useAuth } from "@clerk/nextjs";

// Define the form schema with Zod
const ganadoFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  fechaNac: z.date().optional(),
  diasNacida: z.number().optional().nullable(),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
  establo: z.string().optional(),
  remate: z.boolean().optional(),
  propietario: z.string().optional(),
  descripcion: z.string().optional(),
  raza: z.string().optional(),
  sexo: z.enum(["MACHO", "HEMBRA"], {
    required_error: "Debe seleccionar el sexo.",
  }),
  numRegistro: z.string().optional(),
  puntaje: z.number().optional().nullable(),
  concursoId: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

type GanadoFormValues = z.infer<typeof ganadoFormSchema>;

// Example Ganado interface (DB model-like)
interface Ganado {
  id?: string;
  nombre: string;
  fechaNac?: Date | null;
  diasNacida?: number | null;
  categoria?: string | null;
  subcategoria?: string | null;
  establo?: string | null;
  remate?: boolean | null;
  propietario?: string | null;
  descripcion?: string | null;
  raza?: string | null;
  sexo: "MACHO" | "HEMBRA";
  numRegistro?: string | null;
  puntaje?: number | null;
  isPublished: boolean;
  isFeatured: boolean;
}

interface Concurso {
  id: string;
  nombre: string;
}

interface Category {
  id: string;
  nombre: string;
  codigo: string;
}

interface GanadoFormProps {
  initialData?: Ganado;
  concursos: Concurso[];
  categories: Category[];
}

export function GanadoForm({
  initialData,
  concursos,
  categories,
}: GanadoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Clerk Auth, but we remove unused variables to avoid ESLint warnings
  const { isLoaded, isSignedIn, getToken } = useAuth();

  // States for combobox data
  const [razas, setRazas] = useState<ComboboxOption[]>([]);
  const [establos, setEstablos] = useState<ComboboxOption[]>([]);
  const [propietarios, setPropietarios] = useState<ComboboxOption[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load initial data
  useEffect(() => {
    async function fetchData() {
      try {
        // Example: check if user is admin
        if (isLoaded && isSignedIn) {
          const token = await getToken({ template: "user-metadata" }); // Nombre correcto
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setIsAdmin(userData.role === "admin");
          }
        }

        // Load Razas
        const razasRes = await fetch("/api/razas");
        if (razasRes.ok) {
          const razasData = await razasRes.json();
          setRazas(razasData);
        }

        // Load Establos
        const establosRes = await fetch("/api/establos");
        if (establosRes.ok) {
          const establosData = await establosRes.json();
          setEstablos(establosData);
        }

        // Load Propietarios
        const propietariosRes = await fetch("/api/propietarios");
        if (propietariosRes.ok) {
          const propietariosData = await propietariosRes.json();
          setPropietarios(propietariosData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar datos iniciales");
      }
    }

    fetchData();
  }, [isLoaded, isSignedIn, getToken]);

  // Functions to create new items in combobox
  const createRaza = async (nombre: string) => {
    const response = await fetch("/api/razas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error("Error al crear raza");
    }

    const newRaza = await response.json();
    setRazas((prev) => [...prev, newRaza]);
    return newRaza.value;
  };

  const createEstablo = async (nombre: string) => {
    const response = await fetch("/api/establos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error("Error al crear establo");
    }

    const newEstablo = await response.json();
    setEstablos((prev) => [...prev, newEstablo]);
    return newEstablo.value;
  };

  const createPropietario = async (nombre: string) => {
    const response = await fetch("/api/propietarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error("Error al crear propietario");
    }

    const newPropietario = await response.json();
    setPropietarios((prev) => [...prev, newPropietario]);
    return newPropietario.value;
  };

  // Form with default values
  const form = useForm<GanadoFormValues>({
    resolver: zodResolver(ganadoFormSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      fechaNac: initialData?.fechaNac
        ? new Date(initialData.fechaNac)
        : undefined,
      diasNacida: initialData?.diasNacida ?? null,
      categoria: initialData?.categoria || "",
      subcategoria: initialData?.subcategoria || "",
      establo: initialData?.establo || "",
      remate: initialData?.remate || false,
      propietario: initialData?.propietario || "",
      descripcion: initialData?.descripcion || "",
      raza: initialData?.raza || "",
      sexo: initialData?.sexo || "MACHO",
      numRegistro: initialData?.numRegistro || "",
      puntaje: initialData?.puntaje ?? null,
      concursoId: "",
      isPublished: initialData?.isPublished || false,
      isFeatured: initialData?.isFeatured || false,
    },
  });

  // Watch the 'fechaNac' field
  const fechaNacValue = form.watch("fechaNac");

  // Update diasNacida when fechaNac changes
  useEffect(() => {
    if (fechaNacValue) {
      const today = new Date();
      const diffDays = differenceInDays(today, fechaNacValue);
      form.setValue("diasNacida", diffDays);
    }
  }, [fechaNacValue, form]);

  async function onSubmit(data: GanadoFormValues) {
    setIsLoading(true);
    try {
      // Re-calculate days if there's a fechaNac
      if (data.fechaNac) {
        const today = new Date();
        const birthDate = new Date(data.fechaNac);
        const diffTime = Math.abs(today.getTime() - birthDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        data.diasNacida = diffDays;
      }

      if (initialData?.id) {
        // Update
        const response = await fetch(`/api/ganado/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el ganado");
        }
        toast.success("Ganado actualizado correctamente.");
      } else {
        // Create
        const response = await fetch("/api/ganado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Error al crear el ganado");
        }
        toast.success("Ganado creado correctamente.");
      }

      router.push("/dashboard/ganado");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar el ganado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del ganado" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número de Registro */}
          <FormField
            control={form.control}
            name="numRegistro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Registro</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Número de registro"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de Nacimiento */}
          <FormField
            control={form.control}
            name="fechaNac"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        onClick={(e) => e.preventDefault()}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={(date) => field.onChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Días de nacida */}
          <FormField
            control={form.control}
            name="diasNacida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Días de Nacido</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Calculado automáticamente"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormDescription>
                  Este valor se calcula automáticamente basado en la fecha de
                  nacimiento.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sexo */}
          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MACHO">Macho</SelectItem>
                    <SelectItem value="HEMBRA">Hembra</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Raza (Combobox) */}
          <FormField
            control={form.control}
            name="raza"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <FormControl>
                  <Combobox
                    options={razas}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Seleccionar o crear raza"
                    emptyMessage="No se encontraron razas"
                    createNewLabel="Crear nueva raza"
                    onCreateNew={async (value) => {
                      const newValue = await createRaza(value);
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categoría (Now we use the categories prop) */}
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.codigo} - {category.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subcategoría */}
          <FormField
            control={form.control}
            name="subcategoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategoría</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Subcategoría"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Establo (Combobox) */}
          <FormField
            control={form.control}
            name="establo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Establo</FormLabel>
                <FormControl>
                  <Combobox
                    options={establos}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Seleccionar o crear establo"
                    emptyMessage="No se encontraron establos"
                    createNewLabel="Crear nuevo establo"
                    onCreateNew={async (value) => {
                      const newValue = await createEstablo(value);
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Propietario (Combobox) */}
          <FormField
            control={form.control}
            name="propietario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Propietario</FormLabel>
                <FormControl>
                  <Combobox
                    options={propietarios}
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Seleccionar o crear propietario"
                    emptyMessage="No se encontraron propietarios"
                    createNewLabel="Crear nuevo propietario"
                    onCreateNew={async (value) => {
                      const newValue = await createPropietario(value);
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Puntaje */}
          <FormField
            control={form.control}
            name="puntaje"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puntaje</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Puntaje"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number.parseInt(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remate (Switch) */}
          <FormField
            control={form.control}
            name="remate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Disponible para remate
                  </FormLabel>
                  <FormDescription>
                    Indicar si el ganado está disponible para remate
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del ganado"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Concurso (solo para Admin) */}
        {isAdmin && (
          <FormField
            control={form.control}
            name="concursoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asignar a Concurso (opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar concurso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Ninguno</SelectItem>
                    {concursos.map((concurso) => (
                      <SelectItem key={concurso.id} value={concurso.id}>
                        {concurso.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Si selecciona un concurso, el ganado será asignado
                  automáticamente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          {/* Destacado */}
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Destacado</FormLabel>
                  <FormDescription>
                    Mostrar este ganado en secciones destacadas.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Publicado */}
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publicado</FormLabel>
                  <FormDescription>
                    Hacer visible este ganado en el sitio.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Guardando..."
            : initialData
            ? "Actualizar ganado"
            : "Crear ganado"}
        </Button>
      </form>
    </Form>
  );
}
