import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export const revalidate = 60 // Cache de 60s

async function getConcursos() {
  return await prisma.concurso.findMany({
    where: { isPublished: true },
    include: {
      company: true,
      ganadoEnConcurso: { include: { ganado: true } },
    },
    orderBy: { fechaInicio: "desc" },
  })
}

export default async function HomePage() {
  const concursos = await getConcursos()

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold mb-6">Concursos Destacados</h2>
      {concursos.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No hay concursos publicados</h3>
          <p className="text-muted-foreground">Vuelve más tarde para ver los próximos concursos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concursos.map((concurso) => (
            <Card key={concurso.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{concurso.nombre}</CardTitle>
                <CardDescription>{concurso.company.nombre} • {formatDate(concurso.fechaInicio)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{concurso.descripcion || "Sin descripción"}</p>
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
      )}
    </div>
  )
}
