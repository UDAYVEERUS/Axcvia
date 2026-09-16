import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { site } from "@/lib/data/site";
import { DB_NAME, getMongoClient } from "@/lib/db";
import { emailLayout, isEmailConfigured, sendMail } from "@/lib/email";

/**
 * Authentication: Google OAuth 2.0 (authorization code + PKCE + state) via
 * Better Auth. There are no passwords. Sessions live in MongoDB (`session`
 * collection) so they can be revoked; the browser only holds a signed,
 * httpOnly session cookie.
 *
 * Authorization: the `role` field on the `user` record ("user" | "admin"),
 * managed by the admin plugin. See lib/admin/auth.ts and lib/student/auth.ts
 * for the checks every page, Server Action and Route Handler goes through.
 */

// Google-verified addresses in ADMIN_EMAILS are promoted to admin when they
// sign in — this is how the first admin gets in. Remove an address here
// before demoting that person in the dashboard, or they'll be re-promoted.
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isGoogleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/**
 * Origins allowed to start a sign-in. Better Auth rejects anything else with
 * "Invalid origin", so the live domain is listed explicitly here rather than
 * relying on BETTER_AUTH_URL being set correctly on every host.
 * Extra origins (preview deployments) can be added via TRUSTED_ORIGINS.
 */
const trustedOrigins = [
  ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  site.url,
  site.url.replace("://www.", "://"),
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:3000", "http://localhost:3100"]),
  ...(process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
].filter((origin, i, all) => all.indexOf(origin) === i);

const client = getMongoClient();

export const auth = betterAuth({
  appName: "Axcvia",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db(DB_NAME), { client }),
  trustedOrigins,

  // Students can use Google or an email + password account.
  // Email verification is intentionally off; password reset goes out over SMTP
  // (lib/email.ts). Without SMTP configured the reset request still returns OK
  // so the form can't be used to discover which emails are registered.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      if (!isEmailConfigured()) {
        console.error("[auth] password reset requested but SMTP is not configured — no email sent to", user.email);
        return;
      }
      const firstName = (user.name ?? "").split(" ")[0] || "there";
      await sendMail({
        to: user.email,
        subject: `Reset your ${site.name} password`,
        text: `Hi ${firstName},\n\nReset your ${site.name} password using this link (valid for 1 hour):\n${url}\n\nIf you didn't ask for this, you can ignore this email — your password stays unchanged.\n\n${site.name} · ${site.phone}`,
        html: emailLayout({
          heading: "Reset your password",
          body: `Hi ${firstName}, we received a request to reset the password for <strong>${user.email}</strong>. This link is valid for one hour.`,
          buttonLabel: "Choose a new password",
          buttonUrl: url,
          footNote: "If you didn't ask for this, ignore this email — your password stays unchanged.",
        }),
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
    },
  },

  user: {
    // App-owned profile fields. `input: false` stops clients setting them
    // through the auth API; the app updates them in Server Actions.
    additionalFields: {
      // Collected on the registration form; students can edit it in their profile.
      phone: { type: "string", required: false, defaultValue: "", input: true },
      wishlist: { type: "string[]", required: false, defaultValue: [], input: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh expiry at most once a day
    // Short-lived signed cache so public pages don't hit the DB on every
    // request. Admin checks bypass it (lib/admin/auth.ts).
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },

  account: {
    // Only link a Google login to an existing user when Google vouches for the email.
    accountLinking: { enabled: true, trustedProviders: ["google"] },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session, ctx) => {
          if (!ctx || adminEmails.length === 0) return;
          const user = await ctx.context.internalAdapter.findUserById(session.userId);
          if (
            user &&
            user.emailVerified &&
            adminEmails.includes(user.email.toLowerCase()) &&
            (user as { role?: string }).role !== "admin"
          ) {
            await ctx.context.internalAdapter.updateUser(user.id, { role: "admin" });
          }
        },
      },
    },
  },

  plugins: [
    admin({ defaultRole: "user", adminRoles: ["admin"] }),
    // Lets Server Actions set/clear auth cookies (sign-out). Must be last.
    nextCookies(),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
