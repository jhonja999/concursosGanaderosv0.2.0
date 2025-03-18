import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GanadoForm } from "@/components/forms/ganado-form"
import { prisma } from "@/lib/prisma"

interface GanadoPageProps {
  params: {
    ganadoId: string
  }
}

export default async function GanadoPage({ params }: GanadoPageProps) {
  const ganado = await prisma.ganado.findUnique({
    where: {
      id: params.ganadoId,
    },
  })

  if (!ganado) {
    notFound()
  }

  const concursos = await prisma.concurso.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      nombre: true,
    },
    orderBy: {
      nombre: "asc",
    },
  })

  // Para este ejemplo, usamos las categorías simuladas
  const categories = [
    { id: "1", codigo: "A", nombre: "Dientes de Leche" },
    { id: "2", codigo: "B", nombre: "Dos Dientes" },
    { id: "3", codigo: "C", nombre: "Cuatro Dientes" },
    { id: "4", codigo: "D", nombre: "Seis Dientes" },
    { id: "5", codigo: "E", nombre: "Boca Llena" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/ganado">
          <Button variant="ghost" size="sm" className="mb-4 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver a ganado
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Editar Ganado</h1>
        <p className="text-muted-foreground">Edita los detalles del ganado.</p>
      </div>

      <div className="border rounded-lg p-6">
        <GanadoForm initialData={ganado} concursos={concursos} categories={categories} />
      </div>
    </div>
  )
}

