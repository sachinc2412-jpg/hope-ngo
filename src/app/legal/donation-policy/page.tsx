import { LegalPage } from "@/components/legal/LegalPage";
export const metadata = { title: "Donation Policy — Hope" };
export default function DonationPolicyPage() {
  return (
    <LegalPage title="Donation Policy">
      <p>
        Placeholder policy covering how donations are handled. Replace with your reviewed
        policy.
      </p>
      <h2>Use of funds</h2>
      <p>Donations support the organization&rsquo;s programs and operations.</p>
      <h2>Refunds</h2>
      <p>
        If a donation was made in error, contact us and we&rsquo;ll review refund
        requests.
      </p>
      <h2>Receipts</h2>
      <p>A receipt is emailed for every completed donation.</p>
    </LegalPage>
  );
}
