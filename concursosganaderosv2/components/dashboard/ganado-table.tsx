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
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

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

interface GanadoTableProps {
  ganado: Ganado[]
}

export function GanadoTable({ ganado }: GanadoTableProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [ganadoToDelete, setGanadoToDelete] = useState<string | null>(null)

  const onDelete = async (id: string) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/ganado/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el ganado")
      }

      toast({
        title: "Ganado eliminado",
        description: "El ganado ha sido eliminado correctamente.",
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el ganado.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setGanadoToDelete(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Fecha Nac.</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ganado.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nombre}</TableCell>
              <TableCell>{item.raza || "-"}</TableCell>
              <TableCell>{item.categoria || "-"}</TableCell>
              <TableCell>
                <Badge variant={item.sexo === "MACHO" ? "default" : "secondary"}>
                  {item.sexo === "MACHO" ? "Macho" : "Hembra"}
                </Badge>
              </TableCell>
              <TableCell>{item.fechaNac ? formatDate(item.fechaNac) : "-"}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    item.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.isPublished ? "Publicado" : "Borrador"}
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
                    <Link href={`/dashboard/ganado/${item.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    </Link>
                    <AlertDialog
                      open={ganadoToDelete === item.id}
                      onOpenChange={(open) => !open && setGanadoToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                            setGanadoToDelete(item.id)
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
                            Esta acción no se puede deshacer. Se eliminará permanentemente el ganado y todos sus datos
                            asociados.
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

