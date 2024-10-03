import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-button";
import { Button } from "@/components/ui/button";
import { Link, Github } from "lucide-react";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Music Master",
  description: "Get your spotify library offline mate. Argh!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


function Header() {
  return (
    <header className="w-full z-40 bg-background">
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
            {/* <ModeToggle /> */}
          </div>
        </nav>
      </div>
    </header>
  )
}