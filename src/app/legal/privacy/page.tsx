import { LegalPage } from "@/components/legal/LegalPage";
export const metadata = { title: "Privacy Policy — Hope" };
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This placeholder describes how the organization collects, uses and protects
        personal data. Replace with your reviewed privacy policy.
      </p>
      <h2>What we collect</h2>
      <p>Donation details, contact information you provide, and basic usage data.</p>
      <h2>How we use it</h2>
      <p>To process donations, send receipts, and communicate about our work.</p>
      <h2>Payments</h2>
      <p>
        Card details are handled by our payment provider and never stored on our servers.
      </p>
      <h2>Your rights</h2>
      <p>You can request access to, correction of, or deletion of your data.</p>
    </LegalPage>
  );
}
