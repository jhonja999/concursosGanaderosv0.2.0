import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompaniesTable } from "@/components/dashboard/companies-table"
import { prisma } from "@/lib/prisma"

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      concursos: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compañías</h1>
          <p className="text-muted-foreground">Gestiona las compañías organizadoras de concursos.</p>
        </div>
        <Link href="/dashboard/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Compañía
          </Button>
        </Link>
      </div>

      <CompaniesTable companies={companies} />
    </div>
  )
}

