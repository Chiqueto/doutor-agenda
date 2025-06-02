import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import {
    PageActions,
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddAppointmentButton from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-columns";


const AppointmentsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/authentication");
    }

    if (!session.user.clinic) {
        redirect("/clinic-form");
    } const clinicId = session.user.clinic.id;

    const [patients, doctors, appointments] = await Promise.all([
        db.query.patientsTable.findMany({
            where: eq(patientsTable.clinicId, clinicId),
            orderBy: (patientsTable, { asc }) => [asc(patientsTable.name)],
        }),
        db.query.doctorsTable.findMany({
            where: eq(doctorsTable.clinicId, clinicId),
            orderBy: (doctorsTable, { asc }) => [asc(doctorsTable.name)],
        }),
        db.query.appointmentsTable.findMany({
            where: eq(appointmentsTable.clinicId, clinicId),
            orderBy: (appointmentsTable, { desc }) => [desc(appointmentsTable.date)],
            with: {
                patient: {
                    columns: {
                        id: true,
                        name: true,
                    },
                },
                doctor: {
                    columns: {
                        id: true,
                        name: true,
                        speciality: true,
                    },
                },
            },
        }),
    ]);

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Agendamentos</PageTitle>
                    <PageDescription>
                        Gerencie os agendamentos da sua clínica
                    </PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <AddAppointmentButton doctors={doctors} patients={patients} />
                </PageActions>            </PageHeader>
            <PageContent>
                <DataTable data={appointments} columns={appointmentsTableColumns} />
            </PageContent>
        </PageContainer>
    );
};

export default AppointmentsPage;
