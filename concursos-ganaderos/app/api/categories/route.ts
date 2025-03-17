/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo categorías" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ message: "Categoría eliminada" })
  } catch (error) {
    return NextResponse.json({ error: "Error eliminando categoría" }, { status: 500 })
  }
}
