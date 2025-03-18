import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// POST: Asignar ganado a un concurso
export async function POST(req: Request) {
  try {
    const { userId } = await auth() // auth() ya devuelve un objeto, no necesita await

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Obtener usuario actual con Clerk
    const user = await currentUser()
    const isAdmin = user?.publicMetadata.role === "ADMIN"

    if (!isAdmin) {
      return new NextResponse("Solo los administradores pueden asignar ganado a concursos", { status: 403 })
    }

    // Obtener los datos del cuerpo de la petición
    const body = await req.json()
    const { ganadoId, concursoId, posicion } = body

    if (!ganadoId || !concursoId) {
      return new NextResponse("Ganado ID y Concurso ID son requeridos", { status: 400 })
    }

    // Verificar si ya existe la relación
    const existingRelation = await prisma.ganadoEnConcurso.findFirst({
      where: { ganadoId, concursoId },
    })

    if (existingRelation) {
      return new NextResponse("El ganado ya está asignado a este concurso", { status: 400 })
    }

    // Crear la relación
    const ganadoEnConcurso = await prisma.ganadoEnConcurso.create({
      data: { ganadoId, concursoId, posicion },
    })

    return NextResponse.json(ganadoEnConcurso)
  } catch (error) {
    console.error("[GANADO_EN_CONCURSO_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// GET: Obtener ganado asignado a un concurso
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const concursoId = searchParams.get("concursoId") || undefined
    const ganadoId = searchParams.get("ganadoId") || undefined

    const whereClause: { concursoId?: string; ganadoId?: string } = {}

    if (concursoId) whereClause.concursoId = concursoId
    if (ganadoId) whereClause.ganadoId = ganadoId

    const ganadoEnConcurso = await prisma.ganadoEnConcurso.findMany({
      where: whereClause,
      include: { ganado: true, concurso: true },
      orderBy: { posicion: "asc" },
    })

    return NextResponse.json(ganadoEnConcurso)
  } catch (error) {
    console.error("[GANADO_EN_CONCURSO_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
