import {
  PageActions,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import { PageContainer } from "@/components/ui/page-container";
import SubscriptionPlan from "./_components/subscription-plan";

const SubscriptionPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinaturas</PageTitle>
          <PageDescription>
            Gerencie as assinaturas da sua clínica
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
