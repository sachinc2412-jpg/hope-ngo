import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountNav } from "@/components/account/AccountNav";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata = { title: "Profile — Hope" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?redirect=/account/profile");

  // Owner-read of their donor row (RLS allows). May be null pre-first-donation.
  const { data: donor } = await supabase
    .from("donors")
    .select("display_name, country")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
      <h1 className="text-ink font-display text-4xl tracking-tight">Your account</h1>
      <AccountNav />
      <h2 className="text-ink font-display mt-10 text-2xl">Profile</h2>
      <ProfileForm
        email={user.email ?? ""}
        displayName={donor?.display_name ?? ""}
        country={donor?.country ?? ""}
      />
    </section>
  );
}
