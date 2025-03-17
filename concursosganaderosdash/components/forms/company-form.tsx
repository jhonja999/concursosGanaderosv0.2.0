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
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { slugify } from "@/lib/utils"

// Define the form schema with Zod
const companyFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  descripcion: z.string().optional(),
  logo: z.string().url({ message: "Debe ser una URL válida" }).optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

// This can come from your database
interface Company {
  id?: string
  nombre: string
  descripcion?: string | null
  slug?: string
  logo?: string | null
  isFeatured: boolean
  isPublished: boolean
}

interface CompanyFormProps {
  initialData?: Company
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Define form with default values
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      descripcion: initialData?.descripcion || "",
      logo: initialData?.logo || "",
      isFeatured: initialData?.isFeatured || false,
      isPublished: initialData?.isPublished || false,
    },
  })

  async function onSubmit(data: CompanyFormValues) {
    setIsLoading(true)

    try {
      const slug = slugify(data.nombre)

      if (initialData?.id) {
        // Update existing company
        const response = await fetch(`/api/companies/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            slug,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar la compañía")
        }

        toast({
          title: "Compañía actualizada",
          description: "La compañía ha sido actualizada correctamente.",
        })
      } else {
        // Create new company
        const response = await fetch("/api/companies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            slug,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al crear la compañía")
        }

        toast({
          title: "Compañía creada",
          description: "La compañía ha sido creada correctamente.",
        })
      }

      router.push("/dashboard/companies")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la compañía.",
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
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la compañía" {...field} />
              </FormControl>
              <FormDescription>Este es el nombre público de la compañía.</FormDescription>
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
                  placeholder="Descripción de la compañía"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Breve descripción de la compañía.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/logo.png" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>URL de la imagen del logo de la compañía.</FormDescription>
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
                  <FormLabel className="text-base">Destacada</FormLabel>
                  <FormDescription>Mostrar esta compañía en secciones destacadas.</FormDescription>
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
                  <FormLabel className="text-base">Publicada</FormLabel>
                  <FormDescription>Hacer visible esta compañía en el sitio.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar compañía" : "Crear compañía"}
        </Button>
      </form>
    </Form>
  )
}

