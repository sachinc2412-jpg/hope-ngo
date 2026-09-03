import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in — Hope" };

export default function SignInPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-20">
      <h1 className="font-display text-ink text-4xl tracking-tight">Welcome back</h1>
      <p className="text-ink-soft mt-2 font-sans">
        Sign in to see your giving and impact.
      </p>
      <div className="mt-8">
        <Suspense>
          <AuthForm mode="signin" />
        </Suspense>
      </div>
      <p className="text-ink-faint mt-8 font-sans text-sm">
        You don&rsquo;t need an account to donate.{" "}
        <a href="/donate" className="text-accent underline underline-offset-2">
          Give as a guest
        </a>
        .
      </p>
    </section>
  );
}
