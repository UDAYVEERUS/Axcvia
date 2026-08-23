import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction, updateProfileAction } from "@/app/student-actions";
import { getCurrentStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Profile", robots: { index: false } };

const msg: Record<string, string> = { invalid: "Name is required.", password: "New password must be at least 8 characters.", current: "Current password is incorrect." };

export default async function ProfilePage({ searchParams }: PageProps<"/dashboard/profile">) {
  const student = (await getCurrentStudent())!;
  const { saved, error } = await searchParams;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {saved && <p className="rounded-lg border border-teal/30 bg-teal/5 p-3 text-sm text-teal lg:col-span-2">Saved.</p>}
      {typeof error === "string" && msg[error] && <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive lg:col-span-2">{msg[error]}</p>}
      <form action={updateProfileAction} className="space-y-4 rounded-xl border bg-card p-5">
        <h2 className="font-semibold text-navy">Your details</h2>
        <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" defaultValue={student.name} required /></div>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" value={student.email} disabled /></div>
        <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={student.phone} /></div>
        <Button type="submit" className="bg-teal text-white hover:bg-teal/90">Save changes</Button>
      </form>
      <form action={changePasswordAction} className="space-y-4 rounded-xl border bg-card p-5">
        <h2 className="font-semibold text-navy">Change password</h2>
        <div className="space-y-2"><Label htmlFor="current">Current password</Label><Input id="current" name="current" type="password" required autoComplete="current-password" /></div>
        <div className="space-y-2"><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" /></div>
        <Button type="submit" variant="outline">Update password</Button>
      </form>
    </div>
  );
}
