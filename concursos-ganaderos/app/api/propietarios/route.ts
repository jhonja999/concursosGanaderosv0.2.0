import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""

    // Obtener propietarios únicos de la tabla de ganado
    const ganados = await prisma.ganado.findMany({
      where: {
        propietario: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        propietario: true,
      },
      distinct: ["propietario"],
    })

    // Extraer y formatear los propietarios con tipado correcto
    const propietarios = ganados
      .filter((g): g is { propietario: string } => g.propietario !== null)
      .map((g) => ({
        value: g.propietario,
        label: g.propietario,
      }))

    return NextResponse.json(propietarios)
  } catch (error) {
    console.error("[PROPIETARIOS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth() // auth() ya devuelve un objeto, no necesita await

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { nombre } = body

    if (!nombre) {
      return new NextResponse("Nombre is required", { status: 400 })
    }

    // No necesitamos crear un registro separado para propietarios,
    // simplemente devolvemos el nombre para usarlo en el formulario
    return NextResponse.json({ value: nombre, label: nombre })
  } catch (error) {
    console.error("[PROPIETARIOS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
