import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await currentUser()

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Obtener el rol del usuario desde los metadatos públicos
    const role = user.publicMetadata.role || "USER"

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0]?.emailAddress,
      role,
    })
  } catch (error) {
    console.error("[AUTH_ME_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

