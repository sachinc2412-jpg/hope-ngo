import { requireAdmin } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin/AdminNav";

/** Admin shell — gates every /admin page on the admin role. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-ink font-display text-3xl tracking-tight">Admin</h1>
      <div className="mt-4">
        <AdminNav />
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
