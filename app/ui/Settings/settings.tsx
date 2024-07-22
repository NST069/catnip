import General from "@/app/ui/Settings/general";
import ProfileSettingsPage from "@/app/ui/Settings/profile";
import Relays from "@/app/ui/Settings/relays";

export default function SettingsPage() {
  return (
    <div className="m-2 space-y-2">
      <ProfileSettingsPage />
      <Relays />
    </div>
  );
}
