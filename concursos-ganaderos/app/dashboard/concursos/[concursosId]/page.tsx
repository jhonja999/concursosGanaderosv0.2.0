import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { GanadoConcursoForm } from "@/components/dashboard/ganado-concurso-form"
import { GanadoConcursoTable } from "@/components/dashboard/ganado-concurso-table"
import { prisma } from "@/lib/prisma"


interface ConcursoPageProps {
  params: {
    concursoId: string
  }
}

export default async function ConcursoPage({ params }: ConcursoPageProps) {
  const concurso = await prisma.concurso.findUnique({
    where: {
      id: params.concursoId,
    },
    include: {
      company: true,
      ganadoEnConcurso: {
        include: {
          ganado: true,
        },
        orderBy: {
          posicion: "asc",
        },
      },
    },
  })

  if (!concurso) {
    notFound()
  }

  // Obtener ganado que no está en este concurso
  const ganadoDisponible = await prisma.ganado.findMany({
    where: {
      ganadoEnConcurso: {
        none: {
          concursoId: params.concursoId,
        },
      },
      isPublished: true,
    },
    orderBy: {
      nombre: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/concursos">
            <Button variant="ghost" size="sm" className="mb-4 flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver a concursos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{concurso.nombre}</h1>
          <p className="text-muted-foreground">
            Organizado por {concurso.company.nombre} • {formatDate(concurso.fechaInicio)}
            {concurso.fechaFin && ` - ${formatDate(concurso.fechaFin)}`}
          </p>
        </div>
        <Link href={`/dashboard/concursos/${params.concursoId}/edit`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Editar concurso
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  concurso.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {concurso.isPublished ? "Publicado" : "Borrador"}
              </span>
              {concurso.isFeatured && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  Destacado
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{concurso.ganadoEnConcurso.length}</p>
            <p className="text-sm text-muted-foreground">Ganado registrado en este concurso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link href={`/concursos/${params.concursoId}`} target="_blank">
              <Button variant="outline" className="w-full justify-start">
                Ver página pública
              </Button>
            </Link>
            <Link href={`/dashboard/ganado/new?concursoId=${params.concursoId}`}>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Crear nuevo ganado
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {concurso.descripcion && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{concurso.descripcion}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="participantes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participantes">Participantes</TabsTrigger>
          <TabsTrigger value="agregar">Agregar Ganado</TabsTrigger>
        </TabsList>
        <TabsContent value="participantes" className="space-y-4">
          <GanadoConcursoTable ganadoEnConcurso={concurso.ganadoEnConcurso} concursoId={params.concursoId} />
        </TabsContent>
        <TabsContent value="agregar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Ganado al Concurso</CardTitle>
              <CardDescription>
                Seleccione el ganado que desea agregar a este concurso. Solo se muestra el ganado que no está
                actualmente en este concurso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GanadoConcursoForm concursoId={params.concursoId} ganadoDisponible={ganadoDisponible} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

