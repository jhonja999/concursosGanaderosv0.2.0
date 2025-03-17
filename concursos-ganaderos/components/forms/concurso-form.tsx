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
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Define the form schema with Zod
const concursoFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  descripcion: z.string().optional(),
  fechaInicio: z.date({
    required_error: "La fecha de inicio es requerida.",
  }),
  fechaFin: z.date().optional(),
  companyId: z.string({
    required_error: "Debe seleccionar una compañía.",
  }),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
})

type ConcursoFormValues = z.infer<typeof concursoFormSchema>

// This can come from your database
interface Concurso {
  id?: string
  nombre: string
  descripcion?: string | null
  fechaInicio: Date
  fechaFin?: Date | null
  companyId: string
  isFeatured: boolean
  isPublished: boolean
}

interface Company {
  id: string
  nombre: string
}

interface ConcursoFormProps {
  initialData?: Concurso
  companies: Company[]
}

export function ConcursoForm({ initialData, companies }: ConcursoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Define form with default values
  const form = useForm<ConcursoFormValues>({
    resolver: zodResolver(concursoFormSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      descripcion: initialData?.descripcion || "",
      fechaInicio: initialData?.fechaInicio ? new Date(initialData.fechaInicio) : new Date(),
      fechaFin: initialData?.fechaFin ? new Date(initialData.fechaFin) : undefined,
      companyId: initialData?.companyId || "",
      isFeatured: initialData?.isFeatured || false,
      isPublished: initialData?.isPublished || false,
    },
  })

  async function onSubmit(data: ConcursoFormValues) {
    setIsLoading(true)

    try {
      if (initialData?.id) {
        // Update existing concurso
        const response = await fetch(`/api/concursos/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar el concurso")
        }

        toast("El concurso ha sido actualizado correctamente.")
      } else {
        // Create new concurso
        const response = await fetch("/api/concursos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Error al crear el concurso")
        }
        toast("El concurso ha sido creado correctamente.")
        
      }

      router.push("/dashboard/concursos")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast("Ocurrió un error al guardar el concurso.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del concurso" {...field} />
              </FormControl>
              <FormDescription>Este es el nombre público del concurso.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del concurso"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Breve descripción del concurso.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>Fecha de inicio</FormLabel>
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
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>Fecha de inicio del concurso.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaFin"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>Fecha de fin (opcional)</FormLabel>
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
                <FormDescription>Fecha de finalización del concurso (opcional).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compañía</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar compañía" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Compañía organizadora del concurso.</FormDescription>
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
                  <FormDescription>Mostrar este concurso en secciones destacadas.</FormDescription>
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
                  <FormDescription>Hacer visible este concurso en el sitio.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar concurso" : "Crear concurso"}
        </Button>
      </form>
    </Form>
  )
}

