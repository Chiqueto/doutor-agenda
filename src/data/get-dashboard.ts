import { and, count, desc, eq, lte, gte, sum, sql } from "drizzle-orm";

import { db } from "@/db";

import { appointmentsTable, patientsTable, doctorsTable } from "@/db/schema";
import dayjs from "dayjs";

interface GetDashboardProps {
  from: string;
  to: string;
  session: any;
}

export const getDashboard = async ({
  from,
  to,
  session,
}: GetDashboardProps) => {
  const chartStartDate = dayjs().subtract(10, "days").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "days").startOf("day").toDate();

  const [
    [totalRevenue],
    [totalAppointments],
    [totalDoctors],
    [totalPatients],
    topDoctors,
    topSpecialities,
    todayAppointments,
    dailyAppointments,
  ] = await Promise.all([
    db
      .select({ total: sum(appointmentsTable.appointmentPriceInCents) })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({ total: count(appointmentsTable.id) })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({ total: count(doctorsTable.id) })
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, session.user.clinic.id)),
    db
      .select({ total: count(patientsTable.id) })
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, session.user.clinic.id)),
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        speciality: doctorsTable.speciality,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(doctorsTable.id, appointmentsTable.doctorId),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .where(eq(appointmentsTable.clinicId, session.user.clinic.id))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(10),
    db
      .select({
        speciality: doctorsTable.speciality,
        appointments: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .groupBy(doctorsTable.speciality)
      .orderBy(desc(count(appointmentsTable.id))),
    db.query.appointmentsTable.findMany({
      where: and(
        //TODO: fix today appointments search
        eq(appointmentsTable.clinicId, session.user.clinic.id),
        gte(appointmentsTable.date, new Date()),
        lte(appointmentsTable.date, new Date()),
      ),
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
        appointments: count(appointmentsTable.id),
        revenue:
          sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as(
            "revenue",
          ),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, chartStartDate),
          lte(appointmentsTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`),
  ]);

  return {
    totalRevenue,
    totalAppointments,
    totalDoctors,
    totalPatients,
    topDoctors,
    topSpecialities,
    todayAppointments,
    dailyAppointments,
  };
};
