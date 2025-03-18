import { notFound } from "next/navigation"
import { ConcursoForm } from "@/components/forms/concurso-form"
import { prisma } from "@/lib/prisma"

interface ConcursoEditPageProps {
  params: {
    concursoId: string
  }
}

export default async function ConcursoEditPage({ params }: ConcursoEditPageProps) {
  const concurso = await prisma.concurso.findUnique({
    where: {
      id: params.concursoId,
    },
  })

  if (!concurso) {
    notFound()
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Editar Concurso</h1>
        <p className="text-muted-foreground">Edita los detalles del concurso.</p>
      </div>

      <div className="border rounded-lg p-6">
        <ConcursoForm initialData={concurso} companies={companies} />
      </div>
    </div>
  )
}

