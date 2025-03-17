import { CompanyForm } from "@/components/forms/company-form"

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Compañía</h1>
        <p className="text-muted-foreground">Crea una nueva compañía organizadora de concursos.</p>
      </div>

      <div className="border rounded-lg p-6">
        <CompanyForm />
      </div>
    </div>
  )
}

