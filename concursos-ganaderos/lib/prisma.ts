/**
 * Archivo: lib/prisma_client.ts
 * Uso: Configura y exporta una instancia de PrismaClient para interactuar con la base de datos.
 */

import { PrismaClient } from "@prisma/client" // Importa PrismaClient para interactuar con la base de datos

// Se utiliza una variable global para evitar la creación de múltiples instancias de PrismaClient en desarrollo
const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

// Crea o reutiliza una instancia de PrismaClient
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

// En entornos que no son de producción, se asigna la instancia de PrismaClient a la variable global
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Log para verificar la conexión a la base de datos
prisma.$connect().then(() => {
  console.log("Conexión a la base de datos establecida correctamente.");
}).catch((error: unknown) => {
  console.error("Error al conectar con la base de datos:", error);
});
