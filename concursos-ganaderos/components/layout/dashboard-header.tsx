"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  BarChart3,
  CalendarDays,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  PieChart,
  Plus,
  Store,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="hidden font-bold md:inline-block">Panel de Administración</span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                isActive("/dashboard") &&
                !isActive("/dashboard/companies") &&
                !isActive("/dashboard/concursos") &&
                !isActive("/dashboard/categorias") &&
                !isActive("/dashboard/ganado") &&
                !isActive("/dashboard/reports")
                  ? "text-primary"
                  : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/companies"
              className={`text-sm font-medium ${
                isActive("/dashboard/companies") ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Compañías
            </Link>
            <Link
              href="/dashboard/concursos"
              className={`text-sm font-medium ${
                isActive("/dashboard/concursos") ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Concursos
            </Link>
            <Link
              href="/dashboard/categorias"
              className={`text-sm font-medium ${
                isActive("/dashboard/categorias") ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Categorías
            </Link>
            <Link
              href="/dashboard/ganado"
              className={`text-sm font-medium ${
                isActive("/dashboard/ganado") ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Ganado
            </Link>
            <Link
              href="/dashboard/reports"
              className={`text-sm font-medium ${
                isActive("/dashboard/reports") ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Reportes
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Crear nuevo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/companies/new">Compañía</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/concursos/new">Concurso</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/categorias/new">Categoría</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ganado/new">Ganado</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú de navegación</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Navegación</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/companies">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Compañías</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/concursos">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Concursos</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/categorias">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Categorías</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ganado">
                  <ListChecks className="mr-2 h-4 w-4" />
                  <span>Ganado</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/reports">
                  <PieChart className="mr-2 h-4 w-4" />
                  <span>Reportes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/home">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Volver al sitio</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/home" className="hidden md:block">
            <Button variant="outline" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Volver al sitio
            </Button>
          </Link>

          <UserButton afterSignOutUrl="/home" />
        </div>
      </div>
    </header>
  )
}

