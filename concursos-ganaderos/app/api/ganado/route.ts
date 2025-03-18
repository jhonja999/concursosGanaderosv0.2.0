import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Ganado, Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get("isFeatured");
    const isPublished = searchParams.get("isPublished");
    const sexo = searchParams.get("sexo");
    const categoria = searchParams.get("categoria");
    const concursoId = searchParams.get("concursoId");

    const whereClause: Prisma.GanadoWhereInput = {};

    if (isFeatured === "true") {
      whereClause.isFeatured = true;
    }

    if (isPublished === "true") {
      whereClause.isPublished = true;
    }

    if (sexo) {
      whereClause.sexo = sexo as Ganado["sexo"];
    }

    if (categoria) {
      whereClause.categoria = categoria;
    }

    const includeClause: Prisma.GanadoInclude = {
      ganadoEnConcurso: {
        include: {
          concurso: true,
        },
      },
    };

    if (concursoId && includeClause.ganadoEnConcurso && typeof includeClause.ganadoEnConcurso === 'object' && 'where' in includeClause.ganadoEnConcurso) {
      includeClause.ganadoEnConcurso.where = {
        concursoId,
      };
    }

    const ganado = await prisma.ganado.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (concursoId) {
      const filteredGanado = ganado.filter((g) => g.ganadoEnConcurso.length > 0);
      return NextResponse.json(filteredGanado);
    }

    return NextResponse.json(ganado);
  } catch (error) {
    console.error("[GANADO_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


/* 
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId } = auth()

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

    // Crear el ganado
    const ganado = await prisma.ganado.create({
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
      await prisma.ganadoEnConcurso.create({
        data: {
          ganadoId: ganado.id,
          concursoId,
        },
      })
    }

    return NextResponse.json(ganado)
  } catch (error) {
    console.error("[GANADO_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isFeatured = searchParams.get("isFeatured")
    const isPublished = searchParams.get("isPublished")
    const sexo = searchParams.get("sexo")
    const categoria = searchParams.get("categoria")
    const concursoId = searchParams.get("concursoId")

    const whereClause: any = {}
    let includeClause: any = {}

    if (isFeatured === "true") {
      whereClause.isFeatured = true
    }

    if (isPublished === "true") {
      whereClause.isPublished = true
    }

    if (sexo) {
      whereClause.sexo = sexo
    }

    if (categoria) {
      whereClause.categoria = categoria
    }

    // Si se proporciona un concursoId, filtrar por ganado en ese concurso
    if (concursoId) {
      includeClause = {
        ganadoEnConcurso: {
          where: {
            concursoId,
          },
          include: {
            concurso: true,
          },
        },
      }
    } else {
      includeClause = {
        ganadoEnConcurso: {
          include: {
            concurso: true,
          },
        },
      }
    }

    const ganado = await prisma.ganado.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: {
        createdAt: "desc",
      },
    })

    // Si se filtró por concursoId, devolver solo el ganado que está en ese concurso
    if (concursoId) {
      const filteredGanado = ganado.filter((g) => g.ganadoEnConcurso.length > 0)
      return NextResponse.json(filteredGanado)
    }

    return NextResponse.json(ganado)
  } catch (error) {
    console.error("[GANADO_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

 */