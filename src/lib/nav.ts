/**
 * Single source of truth for navigation. Header, MobileNav, and Footer all read
 * from here so links never drift out of sync. Routes match the IA in the
 * architecture doc; most are stubs until their build day.
 */
export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Impact", href: "/impact" },
  { label: "Projects", href: "/projects" },
  { label: "Stories", href: "/stories" },
  { label: "Transparency", href: "/transparency" },
  { label: "About", href: "/about" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Mission", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Stories", href: "/stories" },
      { label: "Impact", href: "/impact" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Transparency", href: "/transparency" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Donation policy", href: "/legal/donation-policy" },
    ],
  },
];

export const socialLinks: NavLink[] = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
];
