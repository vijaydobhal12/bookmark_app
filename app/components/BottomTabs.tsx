"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bookmark, Search } from "lucide-react"

export default function BottomTabs() {
  const pathname = usePathname()

  // Hide bottom tabs on authentication pages
  if (pathname?.startsWith("/auth")) {
    return null
  }

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/search", label: "Search", icon: Search },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/20 p-2 pb-safe">
      <div className="flex justify-around items-center max-w-xl mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all duration-300 relative ${
                active 
                  ? "text-[var(--primary)] bg-[var(--primary)]/10" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--secondary)]"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-xs font-medium ${active ? "text-[var(--primary)]" : ""}`}>
                {tab.label}
              </span>
              {active && (
                <div className="absolute -bottom-1 w-8 h-0.5 bg-[var(--primary)] rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
