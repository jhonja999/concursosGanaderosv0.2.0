"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useAuth } from "@clerk/nextjs"
import { BarChart3, Home, LayoutDashboard, Menu, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MainHeader() {
  const { userId, isLoaded, isSignedIn } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Determinar si estamos en el dashboard
  const isDashboard = pathname.startsWith("/dashboard")

  // Determinar si estamos en la página de inicio
  const isHome = pathname === "/" || pathname === "/home"

  // Determinar si estamos en la página de concursos
  const isConcursos = pathname.startsWith("/concursos") && !isDashboard

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Concursos Ganaderos</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/home"
                  className={`flex items-center gap-2 text-lg font-medium ${
                    isHome ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Inicio</span>
                </Link>
                <Link
                  href="/concursos"
                  className={`flex items-center gap-2 text-lg font-medium ${
                    isConcursos ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Concursos</span>
                </Link>
                {isSignedIn && (
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-2 text-lg font-medium ${
                      isDashboard ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/home" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Concursos Ganaderos</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/home"
            className={`text-sm font-medium ${
              isHome ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Inicio
          </Link>
          <Link
            href="/concursos"
            className={`text-sm font-medium ${
              isConcursos ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Concursos
          </Link>
          {isSignedIn && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium ${
                isDashboard ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoaded ? (
            isSignedIn ? (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden md:flex">
                      <Plus className="mr-2 h-4 w-4" />
                      Crear
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Crear nuevo</DropdownMenuLabel>
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
                <UserButton afterSignOutUrl="/home" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="default" size="sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
          )}
        </div>
      </div>
    </header>
  )
}

