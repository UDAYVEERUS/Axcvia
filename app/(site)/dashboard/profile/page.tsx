import type { Metadata } from "next";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOutEverywhereAction, updateProfileAction } from "@/app/student-actions";
import { requireStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Profile", robots: { index: false } };

const msg: Record<string, string> = { invalid: "Name is required." };

export default async function ProfilePage({ searchParams }: PageProps<"/dashboard/profile">) {
  const student = await requireStudent("/dashboard/profile");
  const { saved, error } = await searchParams;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {saved && <p className="rounded-lg border border-teal/30 bg-teal/5 p-3 text-sm text-teal lg:col-span-2">Saved.</p>}
      {typeof error === "string" && msg[error] && <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive lg:col-span-2">{msg[error]}</p>}
      <form action={updateProfileAction} className="space-y-4 rounded-xl border bg-card p-5">
        <h2 className="font-semibold text-navy">Your details</h2>
        <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={student.name} required maxLength={100} /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" value={student.email} disabled /></div>
        <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" defaultValue={student.phone} maxLength={20} /></div>
        <Button type="submit" className="bg-teal text-white hover:bg-teal/90">Save changes</Button>
      </form>
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <h2 className="font-semibold text-navy">Sign-in & security</h2>
        <p className="flex items-start gap-2.5 text-sm text-foreground/80">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
          <span>
            You sign in with Google as <strong className="font-semibold text-navy">{student.email}</strong>. Axcvia never sees or stores your Google password.
          </span>
        </p>
        <p className="text-sm text-muted-foreground">Signed in on a shared or lost device? End every session for your account.</p>
        <form action={signOutEverywhereAction}>
          <Button type="submit" variant="outline"><LogOut className="size-4" aria-hidden /> Sign out of all devices</Button>
        </form>
      </div>
    </div>
  );
}
