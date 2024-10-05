import { Separator } from "@/components/ui/separator";
import PlaylistDownloadPage from "../components/playlists";


export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Spotify</h3>
        <p className="text-sm text-muted-foreground">
          Select and download songs from your playlists.
        </p>
      </div>
      <Separator />
      <PlaylistDownloadPage />
    </div>
  )
}