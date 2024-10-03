import { Github } from "lucide-react";
import { ModeToggle } from "./theme-button";
import { Button } from "./ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full z-40 bg-background px-8">
      <div className="flex h-20 items-center justify-between py-6">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <span className="inline-block font-bold text-2xl">Music Master</span>
        </Link>
        <nav className="flex items-center">
          <div className='space-x-4'>
            <Link href="https://github.com" target="_blank">
              <Button variant="ghost" size="sm">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </nav>
      </div>
    </header>
  )
}
