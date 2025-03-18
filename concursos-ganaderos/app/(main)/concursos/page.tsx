import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

export const revalidate = 60 // Revalida cada 60s

export async function ConcursosList() {
  const concursos = await prisma.concurso.findMany({
    where: { isPublished: true },
    include: {
      company: true,
      ganadoEnConcurso: { include: { ganado: true } },
    },
    orderBy: { fechaInicio: "desc" },
  })

  if (concursos.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No hay concursos publicados</h3>
        <p className="text-muted-foreground">Vuelve más tarde para ver los próximos concursos.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {concursos.map((concurso) => (
        <Card key={concurso.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{concurso.nombre}</CardTitle>
            <CardDescription>
              {concurso.company.nombre} • {formatDate(concurso.fechaInicio)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-muted-foreground">{concurso.descripcion || "Sin descripción"}</p>
            <div className="mt-4 text-sm">
              <span className="font-medium">{concurso.ganadoEnConcurso.length}</span> participantes
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/concursos/${concurso.id}`} className="w-full">
              <Button className="w-full">Ver concurso</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default async function ConcursosPage() {
  const concursos = await ConcursosList()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Todos los Concursos</h1>
        <p className="text-muted-foreground mt-2">Explora todos los concursos ganaderos disponibles</p>
      </div>

      {concursos}
    </div>
  )
}