import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { DB_NAME, getMongoClient } from "@/lib/db";

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

const client = getMongoClient();

export const auth = betterAuth({
  appName: "Axcvia",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db(DB_NAME), { client }),

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
      phone: { type: "string", required: false, defaultValue: "", input: false },
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
