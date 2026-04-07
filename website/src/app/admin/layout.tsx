"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { useAdminSessionTimeout } from "@/lib/useAdminSessionTimeout";

function AdminShell({ children }: { children: React.ReactNode }) {
  useAdminSessionTimeout();

  return (
    <div className="fixed inset-0 flex bg-[#f5f5f5]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
