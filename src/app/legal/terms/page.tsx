import { LegalPage } from "@/components/legal/LegalPage";
export const metadata = { title: "Terms of Use — Hope" };
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        Placeholder terms governing use of this website. Replace with your reviewed terms.
      </p>
      <h2>Use of the site</h2>
      <p>Use the site lawfully and in good faith.</p>
      <h2>Donations</h2>
      <p>Donations are subject to our Donation Policy.</p>
      <h2>Content</h2>
      <p>Content on this site is owned by the organization unless stated otherwise.</p>
    </LegalPage>
  );
}
