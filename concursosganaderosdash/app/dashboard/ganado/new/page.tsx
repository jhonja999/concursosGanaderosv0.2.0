import { GanadoForm } from "@/components/forms/ganado-form"
import prisma from "@/lib/prisma"

export default async function NewGanadoPage() {
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

  // For this example, we'll simulate categories since they're not in the schema
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
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Ganado</h1>
        <p className="text-muted-foreground">Registra un nuevo ganado para los concursos.</p>
      </div>

      <div className="border rounded-lg p-6">
        <GanadoForm concursos={concursos} categories={categories} />
      </div>
    </div>
  )
}

