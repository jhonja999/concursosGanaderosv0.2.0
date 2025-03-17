import { notFound } from "next/navigation"
import { CompanyForm } from "@/components/forms/company-form"
import { prisma } from "@/lib/prisma"
interface CompanyPageProps {
  params: {
    companyId: string
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const company = await prisma.company.findUnique({
    where: {
      id: params.companyId,
    },
  })

  if (!company) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Compañía</h1>
        <p className="text-muted-foreground">Edita los detalles de la compañía.</p>
      </div>

      <div className="border rounded-lg p-6">
        <CompanyForm initialData={company} />
      </div>
    </div>
  )
}

