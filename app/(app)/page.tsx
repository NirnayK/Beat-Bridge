import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, List, RefreshCw, Github, Wrench } from 'lucide-react'

export default function IndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center space-y-6 py-12 md:py-20 lg:py-32 text-center bg-secondary/40 dark:bg-secondary/20">
      <div className="container max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          Streamline Your Offline Music Experience with Music Master
        </h1>
        <p className="mt-4 max-w-2xl mx-auto leading-normal sm:text-xl sm:leading-8">
          Effortlessly manage and download your Spotify and Youtube playlists. Configure your profile, sync your music, and enjoy your favorite tunes offline.
        </p>
        <div className="space-x-4 mt-8">
          <Link href="/profile" passHref>
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="#features" passHref>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Profile Configuration",
      description: "Customize your profile settings for optimal syncing",
      href: "/profile",
    },
    {
      icon: <List className="h-6 w-6" />,
      title: "Playlist Download",
      description: "Select and download specific playlists",
      href: "/playlist-download/spotify",
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Manual Reconciliation",
      description: "Resolve any conflicts or missing tracks manually",
      href: "/manual-reconcile",
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Encode It",
      description: "Encode your song with photo and metadata",
      href: "/encode-it",
    }
  ]

  return (
    <section id="features" className="space-y-6 py-12 md:py-16 lg:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-5xl">Features</h2>
        <p className="max-w-2xl leading-normal text-muted-foreground dark:text-gray-400 sm:text-lg sm:leading-7">
          Music Master offers a range of powerful features to enhance your Spotify experience.
        </p>
      </div>
      <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <Link href={href} passHref>
          <Button className="mt-4 w-full" variant="default">Go to {title}</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
