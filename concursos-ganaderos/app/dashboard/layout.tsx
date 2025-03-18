import type React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { BarChart3, CalendarDays, Home, LayoutDashboard, ListChecks, PieChart, Store, Tag } from "lucide-react"
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
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-bold">Admin Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/companies">
                    <Store className="h-4 w-4" />
                    <span>Compañías</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/concursos">
                    <CalendarDays className="h-4 w-4" />
                    <span>Concursos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/categorias">
                    <Tag className="h-4 w-4" />
                    <span>Categorías</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/ganado">
                    <ListChecks className="h-4 w-4" />
                    <span>Ganado</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={"/dashboard/reports"}>
                    <PieChart className="h-4 w-4" />
                    <span>Reportes</span>
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
                </div>
              </div>
              <Link href="/home">
                <Button variant="ghost" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger />
              <div className="ml-4 text-lg font-medium">Panel de Administración</div>
            </div>
          </header>
          <main className="p-6">
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>{children}</Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}