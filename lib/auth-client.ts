import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Browser-side Better Auth client. Talks to /api/auth on the current origin.
// `phone` is declared here so signUp.email() can send it — it mirrors the
// additionalFields in lib/auth.ts (which can't be imported into client code).
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields({ user: { phone: { type: "string" } } })],
});
