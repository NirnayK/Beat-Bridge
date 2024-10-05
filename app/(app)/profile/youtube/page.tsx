import { Separator } from "@/components/ui/separator";
import { YoutubeForm } from "../forms/youtube-form";


export default function YoutubePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Youtube</h3>
        <p className="text-sm text-muted-foreground">
          Update your Youtube account settings. Configure your user-id and youtube auth token.
        </p>
      </div>
      <Separator />
      <YoutubeForm />
    </div>
  )
}