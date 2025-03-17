import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Ganado {
  id: string
  nombre: string
  categoria?: string | null
  subcategoria?: string | null
  raza?: string | null
  sexo: "MACHO" | "HEMBRA"
  propietario?: string | null
  isGanadora?: boolean
  premios?: string[]
}

interface GanadoTableProps {
  ganadoList: Ganado[]
}

export function GanadoTable({ ganadoList }: GanadoTableProps) {
  if (ganadoList.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No hay participantes</h3>
        <p className="text-muted-foreground">No se encontraron participantes en este concurso.</p>
      </div>
    )
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
            <TableHead>Propietario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ganadoList.map((ganado) => (
            <TableRow key={ganado.id}>
              <TableCell className="font-medium">{ganado.nombre}</TableCell>
              <TableCell>{ganado.raza || "-"}</TableCell>
              <TableCell>{ganado.categoria || "-"}</TableCell>
              <TableCell>
                <Badge variant={ganado.sexo === "MACHO" ? "default" : "secondary"}>
                  {ganado.sexo === "MACHO" ? "Macho" : "Hembra"}
                </Badge>
              </TableCell>
              <TableCell>{ganado.propietario || "-"}</TableCell>
              <TableCell>
                {ganado.isGanadora ? (
                  <Badge variant="destructive">Ganadora</Badge>
                ) : (
                  <Badge variant="outline">Participante</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/ganado/${ganado.id}`}>
                  <Button variant="ghost" size="sm">
                    Ver
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

