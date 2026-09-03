import Link from "next/link";

/**
 * Get involved — the ways to support. These are structural site features (not
 * editorial content), so they're defined here with links to their destinations.
 * Some targets (fundraise, volunteer) live on /get-involved, built Day 30.
 */
const WAYS = [
  { title: "Give once", desc: "A single gift, working immediately.", href: "/donate" },
  {
    title: "Monthly giving",
    desc: "Sustained support that compounds.",
    href: "/donate?type=monthly",
  },
  {
    title: "Fundraise",
    desc: "Rally your community around a cause.",
    href: "/get-involved#fundraise",
  },
  {
    title: "Volunteer",
    desc: "Give your time and skills.",
    href: "/get-involved#volunteer",
  },
  {
    title: "Corporate partnership",
    desc: "Align your company with impact.",
    href: "/get-involved#corporate",
  },
  {
    title: "Become a partner",
    desc: "Deliver programs together.",
    href: "/get-involved#partner",
  },
];

export function GetInvolved() {
  return (
    <section className="mx-auto max-w-[var(--container-content)] px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <p className="text-ink-faint font-sans text-sm tracking-wide uppercase">
          Get involved
        </p>
        <h2 className="font-display text-ink mt-3 text-4xl leading-tight tracking-tight md:text-5xl">
          More than one way to make a difference.
        </h2>
      </div>

      <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {WAYS.map((w) => (
          <Link
            key={w.title}
            href={w.href}
            className="group border-line hover:border-accent border-t pt-5 transition-colors"
          >
            <h3 className="font-display text-ink text-2xl">{w.title}</h3>
            <p className="text-ink-soft mt-2 font-sans text-sm leading-relaxed">
              {w.desc}
            </p>
            <span className="text-accent mt-4 inline-block font-sans text-sm font-medium">
              Learn more &rarr;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
