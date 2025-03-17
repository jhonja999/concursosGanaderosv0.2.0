import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GanadoTable } from "@/components/dashboard/ganado-table"
import { prisma } from "@/lib/prisma"

export default async function GanadoPage() {
  const ganado = await prisma.ganado.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ganado</h1>
          <p className="text-muted-foreground">Gestiona el ganado para los concursos.</p>
        </div>
        <Link href="/dashboard/ganado/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Ganado
          </Button>
        </Link>
      </div>

      <GanadoTable ganado={ganado} />
    </div>
  )
}

