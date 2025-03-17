import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoriesTable } from "@/components/dashboard/categories-table"

export default async function CategoriesPage() {
  // For this example, we'll simulate categories since they're not in the schema
  const categories = [
    { id: "1", codigo: "A", nombre: "Dientes de Leche", descripcion: "Categoría para ganado joven" },
    { id: "2", codigo: "B", nombre: "Dos Dientes", descripcion: "Categoría para ganado de edad media" },
    { id: "3", codigo: "C", nombre: "Cuatro Dientes", descripcion: "Categoría para ganado adulto" },
    { id: "4", codigo: "D", nombre: "Seis Dientes", descripcion: "Categoría para ganado maduro" },
    { id: "5", codigo: "E", nombre: "Boca Llena", descripcion: "Categoría para ganado completamente desarrollado" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías para clasificar el ganado.</p>
        </div>
        <Link href="/dashboard/categorias/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </Link>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}

