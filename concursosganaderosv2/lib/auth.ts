import { auth, currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export async function getUserRole() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()

  if (!user) {
    return null
  }

  // Get role from publicMetadata
  const role = (user.publicMetadata.role as string) || "USER"

  return role
}

export async function requireAdmin() {
  const role = await getUserRole()

  if (role !== "ADMIN") {
    redirect("/home")
  }
}

