import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VerifyForm } from "@/components/auth/VerifyForm";

export const metadata = { title: "Verify — Hope" };

export default async function VerifyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/verify");

  return (
    <section className="mx-auto max-w-md px-6 py-24">
      <h1 className="text-ink font-display text-3xl tracking-tight">
        Two-factor verification
      </h1>
      <p className="text-ink-soft mt-2 font-sans text-sm">
        For your security, confirm the second factor to continue to admin.
      </p>
      <VerifyForm />
    </section>
  );
}
