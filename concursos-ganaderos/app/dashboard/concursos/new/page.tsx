import { ConcursoForm } from "@/components/forms/concurso-form"
import prisma from "@/lib/prisma"

export default async function NewConcursoPage() {
  const companies = await prisma.company.findMany({
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Concurso</h1>
        <p className="text-muted-foreground">Crea un nuevo concurso ganadero.</p>
      </div>

      <div className="border rounded-lg p-6">
        <ConcursoForm companies={companies} />
      </div>
    </div>
  )
}

