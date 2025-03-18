import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.id) {
      return new NextResponse("ID is required", { status: 400 })
    }

    const ganadoEnConcurso = await prisma.ganadoEnConcurso.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(ganadoEnConcurso)
  } catch (error) {
    console.error("[GANADO_EN_CONCURSO_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { posicion } = body

    if (!params.id) {
      return new NextResponse("ID is required", { status: 400 })
    }

    const ganadoEnConcurso = await prisma.ganadoEnConcurso.update({
      where: {
        id: params.id,
      },
      data: {
        posicion,
      },
    })

    return NextResponse.json(ganadoEnConcurso)
  } catch (error) {
    console.error("[GANADO_EN_CONCURSO_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

