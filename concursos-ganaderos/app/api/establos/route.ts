import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""

    // Obtener establos únicos de la tabla de ganado
    const ganados = await prisma.ganado.findMany({
      where: {
        establo: {
          not: null,
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        establo: true,
      },
      distinct: ["establo"],
    })

    // Extraer y formatear los establos
    const establos = ganados
      .filter((g): g is { establo: string } => g.establo !== null)
      .map((g) => ({
        value: g.establo,
        label: g.establo,
      }))

    return NextResponse.json(establos)
  } catch (error) {
    console.error("[ESTABLOS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth() 

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { nombre } = body

    if (!nombre) {
      return new NextResponse("Nombre is required", { status: 400 })
    }

    // No necesitamos crear un registro separado para establos,
    // simplemente devolvemos el nombre para usarlo en el formulario
    return NextResponse.json({ value: nombre, label: nombre })
  } catch (error) {
    console.error("[ESTABLOS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
