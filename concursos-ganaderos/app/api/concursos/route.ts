import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma" // Add this import if missing

// Define a type for the where clause
import { Prisma } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const body = await req.json()
    const { nombre, descripcion, fechaInicio, fechaFin, companyId, isFeatured, isPublished } = body
    
    if (!nombre) {
      return new NextResponse("Nombre is required", { status: 400 })
    }
    
    if (!fechaInicio) {
      return new NextResponse("Fecha de inicio is required", { status: 400 })
    }
    
    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 })
    }
    
    const concurso = await prisma.concurso.create({
      data: {
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
        companyId,
        isFeatured,
        isPublished,
      },
    })
    
    return NextResponse.json(concurso)
  } catch (error) {
    console.error("[CONCURSOS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isFeatured = searchParams.get("isFeatured")
    const isPublished = searchParams.get("isPublished")
    const companyId = searchParams.get("companyId")
    
    // Use a properly typed where clause
    const whereClause: Prisma.ConcursoWhereInput = {}
    
    if (isFeatured === "true") {
      whereClause.isFeatured = true
    }
    
    if (isPublished === "true") {
      whereClause.isPublished = true
    }
    
    if (companyId) {
      whereClause.companyId = companyId
    }
    
    const concursos = await prisma.concurso.findMany({
      where: whereClause,
      include: {
        company: true,
        ganadoEnConcurso: {
          include: {
            ganado: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    
    return NextResponse.json(concursos)
  } catch (error) {
    console.error("[CONCURSOS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}