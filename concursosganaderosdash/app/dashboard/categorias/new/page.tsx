import { CategoryForm } from "@/components/forms/category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Categoría</h1>
        <p className="text-muted-foreground">Crea una nueva categoría para clasificar el ganado.</p>
      </div>

      <div className="border rounded-lg p-6">
        <CategoryForm />
      </div>
    </div>
  )
}

