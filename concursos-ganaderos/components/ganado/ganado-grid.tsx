import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Ganado {
  id: string
  nombre: string
  categoria?: string | null
  subcategoria?: string | null
  raza?: string | null
  sexo: "MACHO" | "HEMBRA"
  propietario?: string | null
  isGanadora?: boolean
  premios?: string[]
}

interface GanadoGridProps {
  ganadoList: Ganado[]
}

export function GanadoGrid({ ganadoList }: GanadoGridProps) {
  if (ganadoList.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No hay participantes</h3>
        <p className="text-muted-foreground">No se encontraron participantes en este concurso.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {ganadoList.map((ganado) => (
        <Card key={ganado.id} className="overflow-hidden">
          <div className="aspect-square w-full bg-muted">
            <img
              src={`/placeholder.svg?height=300&width=300&text=${encodeURIComponent(ganado.nombre)}`}
              alt={ganado.nombre}
              className="h-full w-full object-cover"
            />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{ganado.nombre}</CardTitle>
                <CardDescription>{ganado.raza || "Sin raza especificada"}</CardDescription>
              </div>
              <Badge variant={ganado.sexo === "MACHO" ? "default" : "secondary"}>
                {ganado.sexo === "MACHO" ? "Macho" : "Hembra"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 text-sm">
              {ganado.categoria && (
                <div>
                  <span className="font-medium">Categoría:</span> {ganado.categoria}
                </div>
              )}
              {ganado.subcategoria && (
                <div>
                  <span className="font-medium">Subcategoría:</span> {ganado.subcategoria}
                </div>
              )}
              {ganado.propietario && (
                <div>
                  <span className="font-medium">Propietario:</span> {ganado.propietario}
                </div>
              )}
              {ganado.isGanadora && (
                <div className="mt-2">
                  <Badge variant="destructive" className="mr-1">
                    Ganadora
                  </Badge>
                  {ganado.premios &&
                    ganado.premios.map((premio, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mt-1">
                        {premio}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/ganado/${ganado.id}`} className="w-full">
              <Button variant="secondary" className="w-full">
                Ver detalles
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

