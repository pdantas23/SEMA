"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import type { AdminRole } from "@/lib/types";

interface AdminShellProps {
  role: AdminRole | null;
  userEmail: string | undefined;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AdminShell({ role, userEmail, onLogout, children }: AdminShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminNav role={role} userEmail={userEmail} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
