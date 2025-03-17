"use client"

import { useState } from "react"
import Link from "next/link"
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
import { formatDate } from "@/lib/utils"
import { GanadoEnConcurso } from "@prisma/client"

interface Concurso {
  id: string
  nombre: string
  fechaInicio: Date
  fechaFin?: Date | null
  isPublished: boolean
  isFeatured: boolean
  company: {
    nombre: string
  }
  ganadoEnConcurso: GanadoEnConcurso[]
}

interface ConcursosTableProps {
  concursos: Concurso[]
}

export function ConcursosTable({ concursos }: ConcursosTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [concursoToDelete, setConcursoToDelete] = useState<string | null>(null)

  const onDelete = async (id: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/concursos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el concurso")
      }

      toast.success("Concurso eliminado", {
        description: "El concurso ha sido eliminado correctamente.",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Ocurrió un error al eliminar el concurso.",
      })
    } finally {
      setIsLoading(false)
      setConcursoToDelete(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Compañía</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Participantes</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Destacado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {concursos.map((concurso) => (
            <TableRow key={concurso.id}>
              <TableCell className="font-medium">{concurso.nombre}</TableCell>
              <TableCell>{concurso.company.nombre}</TableCell>
              <TableCell>{formatDate(concurso.fechaInicio)}</TableCell>
              <TableCell>{concurso.ganadoEnConcurso.length}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    concurso.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {concurso.isPublished ? "Publicado" : "Borrador"}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    concurso.isFeatured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {concurso.isFeatured ? "Destacado" : "Normal"}
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
                    <Link href={`/dashboard/concursos/${concurso.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    </Link>
                    <AlertDialog
                      open={concursoToDelete === concurso.id}
                      onOpenChange={(open) => !open && setConcursoToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                            setConcursoToDelete(concurso.id)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el concurso y todos sus datos
                            asociados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(concurso.id)} disabled={isLoading}>
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

