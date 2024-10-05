import { Separator } from "@/components/ui/separator";
import { SpotifyForm } from "../forms/spotify-form";


export default function SpotifyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Spotify</h3>
        <p className="text-sm text-muted-foreground">
          Update your Spotify account settings. Configure your client ID and secret.
        </p>
      </div>
      <Separator />
      <SpotifyForm />
    </div>
  )
}