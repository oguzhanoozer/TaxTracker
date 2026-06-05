"use client"

import { useNotification } from "@/app/(app)/context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserProfile } from "@/lib/auth"
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChevronDown,
  FileText,
  Globe,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Settings,
  Wrench,
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

import { Blinker } from "./blinker"

const NAV_GROUPS = [
  {
    group: "Books",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { id: "unsorted", label: "Unsorted inbox", icon: Inbox, href: "/unsorted", showCount: true },
      { id: "transactions", label: "Transactions", icon: ListChecks, href: "/transactions" },
    ],
  },
  {
    group: "Tools",
    items: [
      { id: "invoices", label: "Invoices", icon: FileText, href: "/apps/invoices" },
      { id: "export", label: "Export", icon: ArrowUpToLine, href: "/export" },
      { id: "import", label: "Import", icon: ArrowDownToLine, href: "/import" },
    ],
  },
]

function LedgerLogo() {
  return (
    <div className="flex items-center gap-2.5 px-1 py-1">
      <div
        className="w-8 h-8 rounded-lg grid place-items-center text-base font-serif font-medium shrink-0"
        style={{
          background: "var(--accent)",
          color: "hsl(45 40% 95%)",
          boxShadow: "0 1px 2px rgba(30,27,22,0.06)",
        }}
      >
        L
      </div>
      <span className="font-serif text-xl tracking-tight">Ledger</span>
    </div>
  )
}

export function AppSidebar({
  profile,
  unsortedFilesCount,
  isSelfHosted,
}: {
  profile: UserProfile
  unsortedFilesCount: number
  isSelfHosted: boolean
}) {
  const { setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const { notification } = useNotification()

  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link href="/" className="block hover:opacity-90 transition-opacity">
          <LedgerLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-2">
        <nav className="flex flex-col gap-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.group}>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.08em] px-2 pb-2 text-muted-foreground">
                {group.group}
              </div>
              <div className="grid gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-all"
                      style={{
                        background: active ? "hsl(var(--card))" : "transparent",
                        color: active ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                        fontWeight: active ? 600 : 500,
                        boxShadow: active
                          ? "0 1px 2px rgba(30,27,22,0.05), 0 1px 3px rgba(30,27,22,0.04)"
                          : "none",
                      }}
                    >
                      <Icon
                        className="w-[18px] h-[18px] shrink-0"
                        style={{
                          color: active
                            ? "var(--accent)"
                            : "var(--ink-3)",
                        }}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.id === "unsorted" && unsortedFilesCount > 0 && (
                        <span
                          className="font-mono-num text-[11px] font-bold px-1.5 py-px rounded-full"
                          style={{
                            background: "hsl(40 60% 88%)",
                            color: "hsl(40 60% 30%)",
                          }}
                        >
                          {unsortedFilesCount}
                        </span>
                      )}
                      {item.id === "transactions" &&
                        notification?.code === "sidebar.transactions" &&
                        notification.message && <Blinker />}
                      {item.id === "unsorted" &&
                        notification?.code === "sidebar.unsorted" &&
                        notification.message && <Blinker />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <div className="px-2 pt-3 border-t border-border grid gap-0.5">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-all"
            style={{
              background: pathname.startsWith("/settings")
                ? "hsl(var(--card))"
                : "transparent",
              color: pathname.startsWith("/settings")
                ? "hsl(var(--foreground))"
                : "hsl(var(--muted-foreground))",
              fontWeight: pathname.startsWith("/settings") ? 600 : 500,
              boxShadow: pathname.startsWith("/settings")
                ? "0 1px 2px rgba(30,27,22,0.05)"
                : "none",
            }}
          >
            <Settings
              className="w-[18px] h-[18px]"
              style={{
                color: pathname.startsWith("/settings")
                  ? "var(--accent)"
                  : "var(--ink-3)",
              }}
            />
            Settings
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-2.5 py-2 rounded-md text-sm font-medium"
            style={{ color: "var(--ink-3)" }}
          >
            <Globe className="w-[18px] h-[18px]" />
            View public site
          </Link>

          {/* user chip */}
          <div className="flex items-center gap-2.5 pt-2.5 pb-1 px-1">
            <div
              className="w-8 h-8 rounded-full grid place-items-center font-bold text-xs shrink-0"
              style={{
                background: "var(--accent)",
                color: "hsl(45 40% 95%)",
              }}
            >
              {(profile.name || profile.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">
                {profile.name || "You"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {isSelfHosted ? "Self-hosted" : profile.email}
              </div>
            </div>
            <ChevronDown
              className="w-3.5 h-3.5"
              style={{ color: "var(--ink-3)" }}
            />
          </div>

          {/* Hide unused tools tile in collapsed state */}
          <div className="hidden">
            <Wrench />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
