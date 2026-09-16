import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/site/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
