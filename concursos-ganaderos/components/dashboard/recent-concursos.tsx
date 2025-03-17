import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

export async function RecentConcursos() {
  const concursos = await prisma.concurso.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      company: true,
      ganadoEnConcurso: true,
    },
  })

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
              <TableCell className="text-right">
                <Link href={`/dashboard/concursos/${concurso.id}`}>
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

