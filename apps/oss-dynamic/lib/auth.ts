import { betterAuth } from "better-auth";
import { createPool } from "mysql2";
import { Pool } from "pg";
import { Kysely, MysqlDialect, PostgresDialect } from "kysely";
import { multiSession, organization } from "better-auth/plugins";
import { Resend } from "resend";
import { EmailTemplate } from "@daveyplate/better-auth-ui/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// const dialect = new MysqlDialect({
//   pool: createPool({
//     database: "saas_foundations",
//     host: "localhost",
//     user: "root",
//     password: "password",
//     port: 3306,
//     connectionLimit: 10,
//   }),
// });

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "saas_foundations",
    host: "localhost",
    user: "postgres",
    password: "secret",
    port: 5432,
    max: 10,
  }),
});

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const name = user.name || user.email.split("@")[0];

      await resend.emails.send({
        from: "rajiv@teurons.com",
        to: user.email,
        subject: "Reset your password",
        react: EmailTemplate({
          action: "Reset Password",
          heading: "Reset your password",
          url: url,
          baseUrl: "https://saas-foundations.dev",
          siteName: "SaaS Foundations",
          content: `Hello ${name},`,
        }),
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const name = user.name || user.email.split("@")[0];

      await resend.emails.send({
        from: "rajiv@teurons.com",
        to: user.email,
        subject: "Verify your email address",
        react: EmailTemplate({
          action: "Verify Email",
          heading: "Verify your email address",
          url: url,
          baseUrl: "https://saas-foundations.dev",
          siteName: "SaaS Foundations",
          content: `Hello ${name},`,
        }),
      });
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
  },
  database: {
    dialect,
    type: "postgres",
  },
  plugins: [multiSession(), organization({})],
});
