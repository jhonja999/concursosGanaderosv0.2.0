"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Define the form schema with Zod
const ganadoFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  fechaNac: z.date().optional(),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
  establo: z.string().optional(),
  propietario: z.string().optional(),
  descripcion: z.string().optional(),
  raza: z.string().optional(),
  sexo: z.enum(["MACHO", "HEMBRA"], {
    required_error: "Debe seleccionar el sexo.",
  }),
  numRegistro: z.string().optional(),
  concursoId: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

type GanadoFormValues = z.infer<typeof ganadoFormSchema>

// This can come from your database
interface Ganado {
  id?: string
  nombre: string
  fechaNac?: Date | null
  categoria?: string | null
  subcategoria?: string | null
  establo?: string | null
  propietario?: string | null
  descripcion?: string | null
  raza?: string | null
  sexo: "MACHO" | "HEMBRA"
  numRegistro?: string | null
  isPublished: boolean
  isFeatured: boolean
}

interface Concurso {
  id: string
  nombre: string
}

interface Category {
  id: string
  nombre: string
  codigo: string
}

interface GanadoFormProps {
  initialData?: Ganado
  concursos: Concurso[]
  categories: Category[]
}

export function GanadoForm({ initialData, concursos, categories }: GanadoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Define form with default values
  const form = useForm<GanadoFormValues>({
    resolver: zodResolver(ganadoFormSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      fechaNac: initialData?.fechaNac ? new Date(initialData.fechaNac) : undefined,
      categoria: initialData?.categoria || "",
      subcategoria: initialData?.subcategoria || "",
      establo: initialData?.establo || "",
      propietario: initialData?.propietario || "",
      descripcion: initialData?.descripcion || "",
      raza: initialData?.raza || "",
      sexo: initialData?.sexo || "MACHO",
      numRegistro: initialData?.numRegistro || "",
      concursoId: "",
      isPublished: initialData?.isPublished || false,
      isFeatured: initialData?.isFeatured || false,
    },
  })

  async function onSubmit(data: GanadoFormValues) {
    setIsLoading(true)

    try {
      if (initialData?.id) {
        // Update existing ganado
        const response = await fetch(`/api/ganado/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar el ganado")
        }

        toast({
          title: "Ganado actualizado",
          description: "El ganado ha sido actualizado correctamente.",
        })
      } else {
        // Create new ganado
        const response = await fetch("/api/ganado", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Error al crear el ganado")
        }

        toast({
          title: "Ganado creado",
          description: "El ganado ha sido creado correctamente.",
        })
      }

      router.push("/dashboard/ganado")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el ganado.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

          <FormField
            control={form.control}
            name="numRegistro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Registro</FormLabel>
                <FormControl>
                  <Input placeholder="Número de registro" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <FormField
            control={form.control}
            name="raza"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <FormControl>
                  <Input placeholder="Raza del ganado" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.codigo} - {category.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategoría</FormLabel>
                <FormControl>
                  <Input placeholder="Subcategoría" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="establo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Establo</FormLabel>
                <FormControl>
                  <Input placeholder="Establo" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propietario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Propietario</FormLabel>
                <FormControl>
                  <Input placeholder="Propietario" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="concursoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asignar a Concurso (opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar concurso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {concursos.map((concurso) => (
                    <SelectItem key={concurso.id} value={concurso.id}>
                      {concurso.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Si selecciona un concurso, el ganado será asignado automáticamente.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Destacado</FormLabel>
                  <FormDescription>Mostrar este ganado en secciones destacadas.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publicado</FormLabel>
                  <FormDescription>Hacer visible este ganado en el sitio.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar ganado" : "Crear ganado"}
        </Button>
      </form>
    </Form>
  )
}

