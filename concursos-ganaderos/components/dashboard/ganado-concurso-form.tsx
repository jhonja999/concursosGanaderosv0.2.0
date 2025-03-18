"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define the form schema with Zod
const ganadoConcursoFormSchema = z.object({
  ganadoId: z.string({
    required_error: "Debe seleccionar un ganado.",
  }),
  posicion: z.number().optional(),
});

type GanadoConcursoFormValues = z.infer<typeof ganadoConcursoFormSchema>;

interface Ganado {
  id: string;
  nombre: string;
  raza?: string | null;
  sexo: "MACHO" | "HEMBRA";
}

interface GanadoConcursoFormProps {
  concursoId: string;
  ganadoDisponible: Ganado[];
}

export function GanadoConcursoForm({
  concursoId,
  ganadoDisponible,
}: GanadoConcursoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Define form with default values
  const form = useForm<GanadoConcursoFormValues>({
    resolver: zodResolver(ganadoConcursoFormSchema),
    defaultValues: {
      ganadoId: "",
      posicion: undefined,
    },
  });

  async function onSubmit(data: GanadoConcursoFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ganado-en-concurso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ganadoId: data.ganadoId,
          concursoId,
          posicion: data.posicion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al asignar ganado al concurso"
        );
      }

      toast.success("Ganado asignado al concurso correctamente.");
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al asignar el ganado al concurso.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ganadoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ganado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ganado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ganadoDisponible.map((ganado) => (
                    <SelectItem key={ganado.id} value={ganado.id}>
                      {ganado.nombre} - {ganado.raza || "Sin raza"} (
                      {ganado.sexo === "MACHO" ? "Macho" : "Hembra"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione el ganado que desea asignar a este concurso.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="posicion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posición (opcional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Posición en el concurso"
                  {...field}
                  value={field.value === undefined ? "" : field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(
                      value === "" ? undefined : parseInt(value, 10)
                    );
                  }}
                />
              </FormControl>
              <FormDescription>
                Posición del ganado en el concurso (para ordenamiento).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || ganadoDisponible.length === 0}
        >
          {isLoading ? "Asignando..." : "Asignar ganado al concurso"}
        </Button>

        {ganadoDisponible.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay ganado disponible para asignar a este concurso. Cree nuevo
            ganado primero.
          </p>
        )}
      </form>
    </Form>
  );
}
