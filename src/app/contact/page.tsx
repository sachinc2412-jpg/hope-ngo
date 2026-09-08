import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = { title: "Contact — Hope" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-ink font-display text-5xl leading-tight tracking-tight md:text-6xl">
            Get in touch
          </h1>
          <p className="text-ink-soft mt-4 max-w-md font-sans text-lg">
            Questions, partnerships, or press — we&rsquo;d love to hear from you.
          </p>
          <p className="text-ink-faint mt-8 font-sans text-sm">
            Placeholder contact details — replace with the organization&rsquo;s real
            address, phone and email.
          </p>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
