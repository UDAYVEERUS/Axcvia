import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, registerAction } from "@/app/student-actions";

const messages: Record<string, string> = {
  invalid: "Incorrect email or password.",
  exists: "An account with this email already exists — log in instead.",
  password: "Password must be at least 8 characters.",
  nodb: "Accounts are not available yet — the database is not connected.",
};

export function AuthCard({ mode, next, error }: { mode: "login" | "register"; next: string; error?: string }) {
  const isLogin = mode === "login";
  return (
    <section className="mx-auto flex max-w-md flex-col px-4 pb-20 pt-32 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">{isLogin ? "Welcome back" : "Create your student account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isLogin ? "Sign in to access your courses, mock tests and certificates." : "One account for all your courses, recordings, mock test results and certificates."}
      </p>
      {error && messages[error] && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{messages[error]}</p>
      )}
      <form action={isLogin ? loginAction : registerAction} className="mt-6 space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <input type="hidden" name="next" value={next} />
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 XXXXX XXXXX" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete={isLogin ? "current-password" : "new-password"} />
          {!isLogin && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
        </div>
        <Button type="submit" size="lg" className="w-full bg-teal text-white hover:bg-teal/90">
          {isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : "Already registered? "}
        <Link href={`${isLogin ? "/register" : "/login"}?next=${encodeURIComponent(next)}`} className="font-medium text-teal hover:underline">
          {isLogin ? "Register now" : "Sign in"}
        </Link>
      </p>
      {isLogin && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Forgot your password? Call us at {" "}
          <a href="tel:+919196005457" className="underline">+91 91960 05457</a> and we&apos;ll reset it for you.
        </p>
      )}
    </section>
  );
}
