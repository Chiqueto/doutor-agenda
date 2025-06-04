import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set");
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook secret is not set");
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature is not set");
  }

  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      if (!event.data.object.id) {
        throw new Error();
      }
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );

      if (!subscription) {
        throw new Error();
      }

      const userId = subscription.metadata.userId;
    }
  }
};
