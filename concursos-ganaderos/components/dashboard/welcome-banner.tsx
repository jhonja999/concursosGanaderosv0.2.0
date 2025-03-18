"use client"

import { useAuth } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function WelcomeBanner() {
  const { userId } = useAuth()

  // Obtener la hora del día para personalizar el saludo
  const hour = new Date().getHours()
  let greeting = "Buenos días"

  if (hour >= 12 && hour < 18) {
    greeting = "Buenas tardes"
  } else if (hour >= 18 || hour < 5) {
    greeting = "Buenas noches"
  }

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-xl">
          {greeting}, {userId ? `Usuario ${userId}` : "Administrador"}
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Bienvenido al panel de administración de Concursos Ganaderos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Desde aquí puedes gestionar todos los aspectos del sistema: compañías, concursos, categorías y ganado. Utiliza
          las acciones rápidas a continuación para empezar a crear contenido.
        </p>
      </CardContent>
    </Card>
  )
}
