import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VolunteerForm } from "@/components/involved/VolunteerForm";

export const metadata = {
  title: "Get involved — Hope",
  description: "More than one way to make a difference.",
};

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-line scroll-mt-20 border-t">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-16 md:py-20">
        <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
          {eyebrow}
        </p>
        <h2 className="text-ink font-display mt-3 text-3xl tracking-tight md:text-4xl">
          {title}
        </h2>
        <div className="mt-6 max-w-2xl">{children}</div>
      </div>
    </section>
  );
}

export default function GetInvolvedPage() {
  return (
    <div>
      <section className="mx-auto max-w-[var(--container-content)] px-6 py-20 md:py-28">
        <h1 className="text-ink font-display max-w-3xl text-5xl leading-tight tracking-tight md:text-6xl">
          More than one way to make a difference.
        </h1>
        <p className="text-ink-soft mt-4 max-w-xl font-sans text-lg">
          Give, raise, volunteer, or partner — every contribution moves the work forward.
        </p>
      </section>

      <Section id="give" eyebrow="Give" title="Make a one-time gift">
        <p className="text-ink-soft font-sans leading-relaxed">
          The simplest way to help — a single gift that goes to work immediately.
        </p>
        <Button asChild className="mt-6">
          <Link href="/donate">Donate now</Link>
        </Button>
      </Section>

      <Section id="fundraise" eyebrow="Fundraise" title="Rally your community">
        <p className="text-ink-soft font-sans leading-relaxed">
          Run a campaign for a cause you care about — a birthday, a challenge, a
          milestone. Reach out and we&rsquo;ll help you set it up.
        </p>
      </Section>

      <Section id="volunteer" eyebrow="Volunteer" title="Give your time and skills">
        <p className="text-ink-soft mb-8 font-sans leading-relaxed">
          Tell us how you&rsquo;d like to help. We&rsquo;ll match you with where
          you&rsquo;re needed.
        </p>
        <VolunteerForm />
      </Section>

      <Section
        id="corporate"
        eyebrow="Corporate partnership"
        title="Align your company with impact"
      >
        <p className="text-ink-soft font-sans leading-relaxed">
          Employee giving, matched donations, sponsorships and more. Get in touch to
          explore a partnership.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/contact">Contact us</Link>
        </Button>
      </Section>

      <Section id="partner" eyebrow="Become a partner" title="Deliver programs together">
        <p className="text-ink-soft font-sans leading-relaxed">
          We work with organizations on the ground to reach more communities. If
          that&rsquo;s you, let&rsquo;s talk.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/contact">Start a conversation</Link>
        </Button>
      </Section>
    </div>
  );
}
