"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAction } from "next-safe-action/hooks";
import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";

interface SubscriptionPlanProps {
  active?: boolean;
}

export default function SubscriptionPlan({
  active = false,
}: SubscriptionPlanProps) {
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key is not set");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        throw new Error("Stripe is not loaded");
      }

      if (!data?.sessionId) {
        throw new Error("Session ID is not set");
      }

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    },
  });
  const features = [
    "Cadastro de até 3 médicos",
    "Agendamentos ilimitados",
    "Métricas básicas",
    "Cadastro de pacientes",
    "Confirmação manual",
    "Suporte via e-mail",
  ];

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute();
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Essential</h2>
          {active && (
            <Badge className="bg-emerald-100 px-3 py-1 font-medium text-emerald-700 hover:bg-emerald-100">
              Atual
            </Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Para profissionais autônomos ou pequenas clínicas
        </p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">R$59</span>
          <span className="text-gray-500">/ mês</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                </div>
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className="mt-8 w-full border border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-50"
          variant="outline"
          onClick={active ? () => {} : handleSubscribeClick}
          disabled={createStripeCheckoutAction.isExecuting}
        >
          {createStripeCheckoutAction.isExecuting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>{active ? "Gerenciar assinatura" : "Fazer assinatura"}</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
