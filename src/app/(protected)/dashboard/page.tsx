import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageContainer } from "@/components/ui/page-container";
import {
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { AppointmentsChart } from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCard from "./_components/stats-card";
import TopDoctors from "./_components/top-doctors";
import TopSpecialities from "./_components/top-specialities";
interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  const { from, to } = await searchParams;
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  const {
    totalRevenue,
    totalAppointments,
    totalDoctors,
    totalPatients,
    topDoctors,
    topSpecialities,
    todayAppointments,
    dailyAppointments,
  } = await getDashboard({ from, to, session });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral sobre sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        {/* Cards de estatísticas - mantém largura total */}
        <StatsCard
          totalRevenue={Number(totalRevenue.total)}
          totalAppointments={totalAppointments.total}
          totalDoctors={totalDoctors.total}
          totalPatients={totalPatients.total}
        />

        {/* Container principal com largura fixa e consistente */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Gráfico ocupando 9/12 (equivalente a 2.25/3.25) */}
          <div className="xl:col-span-9 w-full">
            <AppointmentsChart dailyAppointmentsData={dailyAppointments} />
          </div>

          {/* Lista de médicos ocupando 3/12 (equivalente a 1/3.25) */}
          <div className="xl:col-span-3 w-full">
            <TopDoctors doctors={topDoctors} />
          </div>
        </div>

        {/* Segunda linha com mesma estrutura para manter alinhamento */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Tabela de agendamentos ocupando 9/12 */}
          <div className="xl:col-span-9 w-full">
            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground" />
                  <CardTitle className="text-base">
                    Agendamentos de hoje
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={appointmentsTableColumns}
                  data={todayAppointments}
                />
              </CardContent>
            </Card>
          </div>

          {/* Especialidades ocupando 3/12 */}
          <div className="xl:col-span-3 w-full">
            <TopSpecialities specialities={topSpecialities} />
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
