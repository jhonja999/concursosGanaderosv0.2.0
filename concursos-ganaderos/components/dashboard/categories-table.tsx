"use client"

import { useState } from "react"
import Link from "next/link" // Agregado import de Link
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table" // Eliminadas TableHead/TableHeader no usados
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Toaster, toast } from "sonner"
import Image from "next/image"

interface Category {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  imageUrl?: string // Agregado campo de imagen
}

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const onDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/categories/${id}`, { // Endpoint específico
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Error al eliminar categoría") // Tipado explícito
      }

      toast.success("Categoría eliminada correctamente")
      router.refresh()
    } catch (error: unknown) { // Mejora de tipado
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast.error(`Error: ${errorMessage}`)
      console.error(errorMessage)
    } finally {
      setIsLoading(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Toaster position="top-center" />
      
      <Table>
        {/* Eliminado TableHeader innecesario */}
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              {/* Columna de imagen */}
              <TableCell className="hidden sm:table-cell">
                <div className="relative h-10 w-10">
                  {category.imageUrl ? (
                    <Image 
                      src={category.imageUrl} 
                      alt={category.nombre} 
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-md">
                      <span className="text-xs text-primary">{category.codigo}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{category.codigo}</TableCell>
              <TableCell>{category.nombre}</TableCell>
              <TableCell className="hidden md:table-cell">{category.descripcion}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/categories/${category.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          setCategoryToDelete(category.id)
                        }}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              {/* AlertDialog movido fuera del loop */}
              {categoryToDelete === category.id && (
                <AlertDialog
                  open={categoryToDelete === category.id}
                  onOpenChange={(open) => !open && setCategoryToDelete(null)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Estás seguro de eliminar <strong>{category.nombre}</strong>?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(category.id)}
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        {isLoading ? "Eliminando..." : "Eliminar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}