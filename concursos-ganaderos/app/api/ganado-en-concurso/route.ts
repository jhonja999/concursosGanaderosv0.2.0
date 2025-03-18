// app/api/ganado-en-concurso/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    
    const body = await req.json()
    const { ganadoId, concursoId, posicion } = body
    
    if (!ganadoId) {
      return new NextResponse("Ganado ID is required", { status: 400 })
    }
    
    if (!concursoId) {
      return new NextResponse("Concurso ID is required", { status: 400 })
    }
    
    // Verificar si ya existe la relación
    const existingRelation = await prisma.ganadoEnConcurso.findFirst({
      where: {
        ganadoId,
        concursoId,
      },
    })
    
    if (existingRelation) {
      return new NextResponse("El ganado ya está asignado a este concurso", {
        status: 400,
      })
    }
    
    // Crear la relación
    const ganadoEnConcurso = await prisma.ganadoEnConcurso.create({
      data: {
        ganadoId,
        concursoId,
        posicion,
      },
    })
    
    return NextResponse.json(ganadoEnConcurso)
  } catch (error) {
    console.error("[GANADO_EN_CONCURSO_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url)
      const concursoId = searchParams.get("concursoId")
      const ganadoId = searchParams.get("ganadoId")
      
      // Define a more specific type instead of 'any'
      const whereClause: {
        concursoId?: string;
        ganadoId?: string;
      } = {};
      
      if (concursoId) {
        whereClause.concursoId = concursoId;
      }
      
      if (ganadoId) {
        whereClause.ganadoId = ganadoId;
      }
      
      const ganadoEnConcurso = await prisma.ganadoEnConcurso.findMany({
        where: whereClause,
        include: {
          ganado: true,
          concurso: true,
        },
        orderBy: {
          posicion: "asc",
        },
      })
      
      return NextResponse.json(ganadoEnConcurso)
    } catch (error) {
      console.error("[GANADO_EN_CONCURSO_GET]", error)
      return new NextResponse("Internal error", { status: 500 })
    }
  }