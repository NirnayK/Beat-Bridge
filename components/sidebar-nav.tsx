"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SidebarNavProps } from "@/types/props"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-muted"
            )}
          >
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
