import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentConcursos } from "@/components/dashboard/recent-concursos"
import { TopCompanies } from "@/components/dashboard/top-companies"
import prisma from "@/lib/prisma"

export default async function DashboardPage() {
  // Fetch summary data
  const concursosCount = await prisma.concurso.count()
  const companiesCount = await prisma.company.count()
  const ganadoCount = await prisma.ganado.count()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de concursos ganaderos.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Concursos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{concursosCount}</div>
            <p className="text-xs text-muted-foreground">Concursos registrados en el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compañías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companiesCount}</div>
            <p className="text-xs text-muted-foreground">Compañías registradas en el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ganado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ganadoCount}</div>
            <p className="text-xs text-muted-foreground">Ganado registrado en el sistema</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="recent">Concursos Recientes</TabsTrigger>
          <TabsTrigger value="companies">Compañías Top</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="space-y-4">
          <DashboardStats />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentConcursos />
        </TabsContent>
        <TabsContent value="companies" className="space-y-4">
          <TopCompanies />
        </TabsContent>
      </Tabs>
    </div>
  )
}

