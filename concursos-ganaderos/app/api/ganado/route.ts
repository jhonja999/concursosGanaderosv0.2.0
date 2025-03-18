import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      nombre,
      fechaNac,
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
      concursoId,
    } = body;

    if (!nombre) {
      return new NextResponse("Nombre is required", { status: 400 });
    }

    if (!sexo) {
      return new NextResponse("Sexo is required", { status: 400 });
    }

    const user = await currentUser();
    const isAdmin = user?.publicMetadata.role === "admin";

    const ganado = await prisma.ganado.create({
      data: {
        nombre,
        fechaNac,
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
    });

    if (concursoId && concursoId !== "none" && isAdmin) {
      await prisma.ganadoEnConcurso.create({
        data: {
          ganadoId: ganado.id,
          concursoId,
        },
      });
    }

    return NextResponse.json(ganado);
  } catch (error) {
    console.error("[GANADO_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get("isFeatured") === "true";
    const isPublished = searchParams.get("isPublished") === "true";
    const sexo = searchParams.get("sexo") || undefined;
    const categoria = searchParams.get("categoria") || undefined;
    const concursoId = searchParams.get("concursoId") || undefined;

    const whereClause: Record<string, unknown> = {};
    const includeClause: Record<string, unknown> = {
      ganadoEnConcurso: {
        include: { concurso: true },
      },
    };

    if (isFeatured) whereClause.isFeatured = true;
    if (isPublished) whereClause.isPublished = true;
    if (sexo) whereClause.sexo = sexo;
    if (categoria) whereClause.categoria = categoria;

    if (concursoId) {
      includeClause.ganadoEnConcurso = {
        where: { concursoId },
        include: { concurso: true },
      };
    }

    const ganado = await prisma.ganado.findMany({
      where: whereClause,
      include: includeClause,
      orderBy: { createdAt: "desc" },
    });

    if (concursoId) {
      return NextResponse.json(ganado.filter((g) => g.ganadoEnConcurso.length > 0));
    }

    return NextResponse.json(ganado);
  } catch (error) {
    console.error("[GANADO_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}