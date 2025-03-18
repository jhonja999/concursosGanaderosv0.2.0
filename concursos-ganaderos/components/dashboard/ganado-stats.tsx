"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"

interface GanadoStats {
  sexo: {
    MACHO: number
    HEMBRA: number
  }
  categorias: {
    [key: string]: number
  }
  total: number
}

export function GanadoStats() {
  const [stats, setStats] = useState<GanadoStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats/ganado")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching ganado stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const sexoData = useMemo(() => {
    return stats
      ? [
          { name: "Machos", value: stats.sexo.MACHO },
          { name: "Hembras", value: stats.sexo.HEMBRA },
        ]
      : []
  }, [stats])

  const categoriasData = useMemo(() => {
    return stats
      ? Object.entries(stats.categorias).map(([name, value]) => ({ name, value }))
      : []
  }, [stats])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Ganado</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse h-full w-full bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Sexo</CardTitle>
          <CardDescription>Proporción de machos y hembras</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sexoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {sexoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución por Categoría</CardTitle>
          <CardDescription>Ganado por categoría</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoriasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name.split(" ")[0]}: ${(percent * 100).toFixed(0)}%`}
              >
                {categoriasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
