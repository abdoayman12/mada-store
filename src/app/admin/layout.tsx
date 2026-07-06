import { AdminAuthProvider } from "@/context/AdminAuthContext";
import AdminGuardLayout from "./AdminGuardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGuardLayout>{children}</AdminGuardLayout>
    </AdminAuthProvider>
  );
}
