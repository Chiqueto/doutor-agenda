import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Número de telefone é obrigatório" })
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length >= 10 && val.length <= 11, {
      message: "Número de telefone deve ter 10 ou 11 dígitos",
    }),
  sex: z.enum(["male", "female"], { message: "Sexo é obrigatório" }),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
