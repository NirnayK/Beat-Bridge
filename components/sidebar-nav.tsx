"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants, Button } from "@/components/ui/button"
import { SidebarNavProps } from "@/types/nav"

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
