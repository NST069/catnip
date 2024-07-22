import Profile from "@/app/ui/Social/profile";

import { GetCurrentAccount } from "@/app/lib/nostr";

export default function ProfilePage() {
  let currentPubkey = GetCurrentAccount()?.pubkey;
  return (
    <div>
      <Profile id={currentPubkey ? currentPubkey : ""} />
    </div>
  );
}
