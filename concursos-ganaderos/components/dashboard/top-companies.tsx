import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

export async function TopCompanies() {
  const companies = await prisma.company.findMany({
    take: 5,
    include: {
      concursos: true,
    },
    orderBy: {
      concursos: {
        _count: "desc",
      },
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Concursos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.nombre}</TableCell>
              <TableCell>{company.concursos.length}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    company.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {company.isPublished ? "Publicado" : "Borrador"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/dashboard/companies/${company.id}`}>
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

