import Link from "next/link"
import { CalendarDays, ListChecks, Store, Tag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  const actions = [
    {
      title: "Nueva Compañía",
      description: "Registra una nueva compañía organizadora",
      icon: Store,
      href: "/dashboard/companies/new",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Nuevo Concurso",
      description: "Crea un nuevo concurso ganadero",
      icon: CalendarDays,
      href: "/dashboard/concursos/new",
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "Nueva Categoría",
      description: "Añade una nueva categoría para el ganado",
      icon: Tag,
      href: "/dashboard/categorias/new",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: "Nuevo Ganado",
      description: "Registra un nuevo ganado para concursos",
      icon: ListChecks,
      href: "/dashboard/ganado/new",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.title} href={action.href} className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className={`mb-2 inline-flex rounded-lg p-2 ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

