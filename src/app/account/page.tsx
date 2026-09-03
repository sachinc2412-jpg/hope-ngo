import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Your account — Hope" };

/**
 * Protected account stub. Middleware already redirects anonymous users, but we
 * re-check here (defence in depth). The real donor dashboard is Day 19.
 */
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in?redirect=/account");

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="font-display text-ink text-4xl tracking-tight">Your account</h1>
      <p className="text-ink-soft mt-3 font-sans">Signed in as {user.email}.</p>
      <p className="text-ink-faint mt-6 font-sans">
        Your donation history, receipts and impact updates will appear here (built Day
        19).
      </p>
      <form action="/auth/sign-out" method="post" className="mt-8">
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </section>
  );
}
