import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { ganadoId: string } }) {
  try {
    if (!params.ganadoId) {
      return new NextResponse("Ganado ID is required", { status: 400 })
    }

    const ganado = await prisma.ganado.findUnique({
      where: {
        id: params.ganadoId,
      },
      include: {
        ganadoEnConcurso: {
          include: {
            concurso: true,
          },
        },
        GanadoImage: {
          include: {
            image: true,
          },
        },
      },
    })

    return NextResponse.json(ganado)
  } catch (error) {
    console.error("[GANADO_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { ganadoId: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const {
      nombre,
      fechaNac,
      diasNacida,
      categoria,
      subcategoria,
      establo,
      remate,
      propietario,
      descripcion,
      raza,
      sexo,
      numRegistro,
      puntaje,
      isFeatured,
      isPublished,
      concursoId, // Para asignar a un concurso
    } = body

    if (!nombre) {
      return new NextResponse("Nombre is required", { status: 400 })
    }

    if (!sexo) {
      return new NextResponse("Sexo is required", { status: 400 })
    }

    if (!params.ganadoId) {
      return new NextResponse("Ganado ID is required", { status: 400 })
    }

    // Actualizar el ganado
    const ganado = await prisma.ganado.update({
      where: {
        id: params.ganadoId,
      },
      data: {
        nombre,
        fechaNac,
        diasNacida,
        categoria,
        subcategoria,
        establo,
        remate,
        propietario,
        descripcion,
        raza,
        sexo,
        numRegistro,
        puntaje,
        isFeatured,
        isPublished,
      },
    })

    // Si se proporciona un concursoId, asignar el ganado al concurso
    if (concursoId && concursoId !== "none") {
      // Verificar si ya existe la relación
      const existingRelation = await prisma.ganadoEnConcurso.findFirst({
        where: {
          ganadoId: params.ganadoId,
          concursoId,
        },
      })

      if (!existingRelation) {
        await prisma.ganadoEnConcurso.create({
          data: {
            ganadoId: params.ganadoId,
            concursoId,
          },
        })
      }
    }

    return NextResponse.json(ganado)
  } catch (error) {
    console.error("[GANADO_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { ganadoId: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.ganadoId) {
      return new NextResponse("Ganado ID is required", { status: 400 })
    }

    // Eliminar todas las relaciones con concursos
    await prisma.ganadoEnConcurso.deleteMany({
      where: {
        ganadoId: params.ganadoId,
      },
    })

    // Eliminar el ganado
    const ganado = await prisma.ganado.delete({
      where: {
        id: params.ganadoId,
      },
    })

    return NextResponse.json(ganado)
  } catch (error) {
    console.error("[GANADO_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

