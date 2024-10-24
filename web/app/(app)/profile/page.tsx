import { ProfileForm } from "./forms/profile-form";
import { Separator } from "@/components/ui/separator";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Update your profile settings. Add your own avatar or change your password.
        </p>
      </div>
      <Separator />
      <ProfileForm type="sign-up" />
    </div>
  )
}