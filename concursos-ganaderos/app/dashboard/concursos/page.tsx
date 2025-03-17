import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConcursosTable } from "@/components/dashboard/concursos-table"
import { prisma } from "@/lib/prisma"

export default async function ConcursosPage() {
  const concursos = await prisma.concurso.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      company: true,
      ganadoEnConcurso: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Concursos</h1>
          <p className="text-muted-foreground">Gestiona los concursos ganaderos.</p>
        </div>
        <Link href="/dashboard/concursos/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Concurso
          </Button>
        </Link>
      </div>

      <ConcursosTable concursos={concursos} />
    </div>
  )
}

