"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const concursosByMonth = [
  { name: "Ene", concursos: 4 },
  { name: "Feb", concursos: 3 },
  { name: "Mar", concursos: 5 },
  { name: "Abr", concursos: 7 },
  { name: "May", concursos: 2 },
  { name: "Jun", concursos: 6 },
  { name: "Jul", concursos: 8 },
  { name: "Ago", concursos: 9 },
  { name: "Sep", concursos: 11 },
  { name: "Oct", concursos: 7 },
  { name: "Nov", concursos: 5 },
  { name: "Dic", concursos: 4 },
]

const ganadoBySexo = [
  { name: "Machos", value: 65 },
  { name: "Hembras", value: 35 },
]

const ganadoByCategoria = [
  { name: "A - Dientes de Leche", ganado: 25 },
  { name: "B - Dos Dientes", ganado: 18 },
  { name: "C - Cuatro Dientes", ganado: 15 },
  { name: "D - Seis Dientes", ganado: 12 },
  { name: "E - Boca Llena", ganado: 30 },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Concursos por Mes</CardTitle>
          <CardDescription>Distribución de concursos a lo largo del año</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={concursosByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="concursos" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ganado por Sexo</CardTitle>
          <CardDescription>Distribución de ganado por sexo</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ganadoBySexo}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Ganado por Categoría</CardTitle>
          <CardDescription>Distribución de ganado por categoría</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ganadoByCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="ganado" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

