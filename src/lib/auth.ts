import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: schema,
  }),

  user: {
    modelName: "usersTable",
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        required: false,
        fieldName: "stripeCustomerId",
      },
      stripeSubscriptionId: {
        type: "string",
        required: false,
        fieldName: "stripeSubscriptionId",
      },
      plan: {
        type: "string",
        required: false,
        fieldName: "plan",
      },
    },
  },

  session: {
    modelName: "sessionsTable",
  },

  account: {
    modelName: "accountsTable",
  },

  verification: {
    modelName: "verificationsTable",
  },

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    customSession(async ({ user, session }) => {
      const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(schema.usersToClinicsTable.userId, user.id),
        with: {
          clinic: true,
        },
      });
      //TODO: ao adaptar para o usuário ter multiplas clínicas, deve-se mudar esse código
      const clinic = clinics?.[0];

      return {
        user: {
          ...user,
          clinic: clinic?.clinicId
            ? {
                id: clinic?.clinicId,
                name: clinic?.clinic?.name,
              }
            : undefined,
        },
        session,
      };
    }),
  ],
});
