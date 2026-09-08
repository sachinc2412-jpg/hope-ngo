import { SecurityForm } from "@/components/admin/SecurityForm";

export const metadata = { title: "Security — Admin" };

export default function AdminSecurityPage() {
  return (
    <div>
      <p className="text-ink-soft font-sans text-sm">
        Protect your admin account with two-factor authentication.
      </p>
      <SecurityForm />
    </div>
  );
}
