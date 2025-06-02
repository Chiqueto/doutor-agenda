"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrencyInCents } from "@/_helpers/currency";
import { appointmentsTable } from "@/db/schema";

import AppointmentTableActions from "./table-actions";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
  };
  doctor: {
    id: string;
    name: string;
    speciality: string;
  };
};

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    id: "doctor",
    accessorKey: "doctor",
    header: "Médico",
    cell: (params) => {
      const doctor = params.row.original.doctor;
      return `${doctor.name}`;
    },
  },
  {
    id: "date",
    accessorKey: "date",
    header: "Data e hora",
    cell: (params) => {
      const date = params.row.original.date;
      return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    },
  },
  {
    id: "speciality",
    accessorKey: "doctor.speciality",
    header: "Especialidade",
  },

  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: (params) => {
      const price = params.row.original.appointmentPriceInCents;
      return formatCurrencyInCents(price);
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return <AppointmentTableActions appointment={appointment} />;
    },
  },
];
