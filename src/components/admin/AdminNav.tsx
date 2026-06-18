"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  CalendarDays,
  Tag,
  Link2,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads (CRM)", href: "/admin/leads", icon: Users },
  { label: "Posts / Blog", href: "/admin/posts", icon: FileText },
  { label: "Notícias", href: "/admin/noticias", icon: Newspaper },
  { label: "Eventos", href: "/admin/eventos", icon: CalendarDays },
  { label: "Categorias", href: "/admin/categorias", icon: Tag },
  { label: "Instagram", href: "/admin/instagram", icon: Link2 },
];

interface AdminNavProps {
  role: AdminRole | null;
  userEmail: string | undefined;
  onLogout: () => void;
}

export function AdminNav({ role, userEmail, onLogout }: AdminNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-azul-petroleo text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-azul-claro font-extrabold text-azul-petroleo text-sm">
          S
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">SEMA Admin</div>
          <div className="text-xs text-white/50 capitalize">{role ?? "—"}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 truncate text-xs text-white/50">{userEmail}</div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
