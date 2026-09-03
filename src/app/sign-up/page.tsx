import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Create account — Hope" };

export default function SignUpPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <h1 className="font-display text-ink text-4xl tracking-tight">
        Create your account
      </h1>
      <p className="text-ink-soft mt-2 font-sans">
        Track your donations, receipts and the impact you make.
      </p>
      <div className="mt-8">
        <Suspense>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </section>
  );
}
