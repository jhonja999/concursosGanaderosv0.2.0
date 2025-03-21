import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { GanadoTable } from "@/components/ganado/ganado-table"
import { GanadoGrid } from "@/components/ganado/ganado-grid"
import { prisma } from "@/lib/prisma"


interface ConcursoPageProps {
  params: { 
    concursoId: string 
  }
  searchParams?: {
    [key: string]: string | string[] | undefined
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
      },
    },
  })

  if (!concurso || !concurso.isPublished) {
    return notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <Link href="/concursos">
          <Button variant="ghost" size="sm" className="gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Volver a concursos
          </Button>
        </Link>

        <h1 className="text-3xl font-bold">{concurso.nombre}</h1>
        <div className="mt-2 flex items-center text-muted-foreground">
          <span>Organizado por {concurso.company.nombre}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(concurso.fechaInicio)}</span>
          {concurso.fechaFin && <span className="mx-2">- {formatDate(concurso.fechaFin)}</span>}
        </div>
        {concurso.descripcion && <p className="mt-4 max-w-3xl text-muted-foreground">{concurso.descripcion}</p>}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Participantes</h2>
        <p className="text-muted-foreground">{concurso.ganadoEnConcurso.length} participantes en este concurso</p>
      </div>

      <Tabs defaultValue="grid" className="mb-8">
        <TabsList>
          <TabsTrigger value="grid">Tarjetas</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-6">
          <GanadoGrid ganadoList={concurso.ganadoEnConcurso.map((item) => item.ganado)} />
        </TabsContent>
        <TabsContent value="table">
          <GanadoTable ganadoList={concurso.ganadoEnConcurso.map((item) => item.ganado)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
