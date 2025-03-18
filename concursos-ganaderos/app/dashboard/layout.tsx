import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { 
  BarChart3, 
  CalendarDays, 
  Home, 
  LayoutDashboard, 
  ListChecks, 
  PieChart, 
  Settings, 
  Store, 
  Tag, 
  Users 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { requireAdmin } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure only admins can access the dashboard
  await requireAdmin()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/5">
        <Sidebar className="border-r">
          <SidebarHeader className="flex items-center px-4 py-3 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2 py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard" className="hover:bg-accent hover:text-accent-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarSeparator className="my-2" />
              <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Gestión</p>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/companies" className="hover:bg-accent hover:text-accent-foreground">
                    <Store className="h-4 w-4" />
                    <span>Compañías</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/concursos" className="hover:bg-accent hover:text-accent-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Concursos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/categorias" className="hover:bg-accent hover:text-accent-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Categorías</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/ganado" className="hover:bg-accent hover:text-accent-foreground">
                    <ListChecks className="h-4 w-4" />
                    <span>Ganado</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarSeparator className="my-2" />
              <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Análisis</p>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/dashboard/reports"} className="hover:bg-accent hover:text-accent-foreground">
                    <PieChart className="h-4 w-4" />
                    <span>Reportes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarSeparator className="my-2" />
              <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Sistema</p>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/dashboard/users"} className="hover:bg-accent hover:text-accent-foreground">
                    <Users className="h-4 w-4" />
                    <span>Usuarios|</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/dashboard/settings"} className="hover:bg-accent hover:text-accent-foreground">
                    <Settings className="h-4 w-4" />
                    <span>Configuración|</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/home" />
                <div className="text-sm">
                  <p className="font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">Panel de Control</p>
                </div>
              </div>
              <Link href="/home">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="border-b bg-white">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="mr-2" />
              <div className="ml-2 text-lg font-medium">Panel de Administración</div>
              <div className="ml-auto flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Hoy
                </Button>
              </div>
            </div>
          </header>
          <main className="p-6">
            <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-lg" />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}