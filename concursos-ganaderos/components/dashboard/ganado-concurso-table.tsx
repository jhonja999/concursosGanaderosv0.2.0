"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { toast } from "sonner"

interface Ganado {
  id: string
  nombre: string
  fechaNac?: Date | null
  categoria?: string | null
  raza?: string | null
  sexo: "MACHO" | "HEMBRA"
  isPublished: boolean
  isFeatured: boolean
}

interface GanadoEnConcurso {
  id: string
  ganadoId: string
  concursoId: string
  posicion?: number | null
  ganado: Ganado
}

interface GanadoConcursoTableProps {
  ganadoEnConcurso: GanadoEnConcurso[]
  concursoId: string
}

export function GanadoConcursoTable({ ganadoEnConcurso, /* concursoId */ }: GanadoConcursoTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const onDelete = async (id: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/ganado-en-concurso/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el ganado del concurso")
      }

      toast.success("Ganado eliminado del concurso correctamente.")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Ocurrió un error al eliminar el ganado del concurso.")
    } finally {
      setIsLoading(false)
      setItemToDelete(null)
    }
  }

  if (ganadoEnConcurso.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium">No hay participantes</h3>
        <p className="mt-2 text-muted-foreground">
          Este concurso aún no tiene ganado asignado. Utilice la pestaña |Agregar Ganado| para añadir participantes.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Posición</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ganadoEnConcurso.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.posicion || "-"}</TableCell>
              <TableCell className="font-medium">{item.ganado.nombre}</TableCell>
              <TableCell>{item.ganado.raza || "-"}</TableCell>
              <TableCell>{item.ganado.categoria || "-"}</TableCell>
              <TableCell>
                <Badge variant={item.ganado.sexo === "MACHO" ? "default" : "secondary"}>
                  {item.ganado.sexo === "MACHO" ? "Macho" : "Hembra"}
                </Badge>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.ganado.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.ganado.isPublished ? "Publicado" : "Borrador"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <Link href={`/dashboard/ganado/${item.ganado.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar ganado
                      </DropdownMenuItem>
                    </Link>
                    <AlertDialog
                      open={itemToDelete === item.id}
                      onOpenChange={(open) => !open && setItemToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                            setItemToDelete(item.id)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Quitar del concurso
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará el ganado de este concurso, pero no eliminará el ganado del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(item.id)} disabled={isLoading}>
                            {isLoading ? "Eliminando..." : "Eliminar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

