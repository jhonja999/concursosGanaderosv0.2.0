"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

// Define the form schema with Zod
const categoryFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  descripcion: z.string().optional(),
  codigo: z
    .string()
    .min(1, {
      message: "El código es requerido.",
    })
    .regex(/^[A-Z]/, {
      message: "El código debe comenzar con una letra mayúscula.",
    }),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

// This can come from your database
interface Category {
  id?: string
  nombre: string
  descripcion?: string | null
  codigo: string
}

interface CategoryFormProps {
  initialData?: Category
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Define form with default values
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      descripcion: initialData?.descripcion || "",
      codigo: initialData?.codigo || "",
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    setIsLoading(true)

    try {
      if (initialData?.id) {
        // Update existing category
        const response = await fetch(`/api/categories/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar la categoría")
        }

        toast({
          title: "Categoría actualizada",
          description: "La categoría ha sido actualizada correctamente.",
        })
      } else {
        // Create new category
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Error al crear la categoría")
        }

        toast({
          title: "Categoría creada",
          description: "La categoría ha sido creada correctamente.",
        })
      }

      router.push("/dashboard/categorias")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la categoría.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="A" {...field} />
              </FormControl>
              <FormDescription>Código de la categoría (ej. A, B, C).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Dientes de Leche" {...field} />
              </FormControl>
              <FormDescription>Nombre de la categoría (ej. Dientes de Leche, Dos Dientes).</FormDescription>
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
                  placeholder="Descripción de la categoría"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Breve descripción de la categoría.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar categoría" : "Crear categoría"}
        </Button>
      </form>
    </Form>
  )
}

