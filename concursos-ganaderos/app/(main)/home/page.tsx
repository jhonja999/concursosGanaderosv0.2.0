import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserRole } from "@/lib/auth"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

async function ConcursosList() {
  const concursos = await prisma.concurso.findMany({
    where: {
      isPublished: true,
    },
    include: {
      company: true,
      ganadoEnConcurso: {
        include: {
          ganado: true,
        },
      },
    },
    orderBy: {
      fechaInicio: "desc",
    },
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
              <Button variant="default" className="w-full">
                Ver concurso
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const role = await getUserRole()

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold mb-6">Concursos Destacados</h2>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        }
      >
        <ConcursosList />
      </Suspense>
    </div>
  )
}

