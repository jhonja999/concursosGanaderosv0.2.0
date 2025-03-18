import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentConcursos } from "@/components/dashboard/recent-concursos"
import { TopCompanies } from "@/components/dashboard/top-companies"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de concursos ganaderos.</p>
      </div>

      <WelcomeBanner />

      <div>
        <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
        <QuickActions />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
        <DashboardOverview />
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

