import Profile from "@/app/ui/profile";
import Breadcrumbs from "@/app/ui/Breadcrumbs";

import { GetCurrentAccount } from "@/app/lib/nostr";

export default function ProfilePage() {
  let currentPubkey = GetCurrentAccount()?.pubkey;
  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Social', href: '/social' },
          {
            label: 'Profile',
            href: `/social/profile/${currentPubkey?currentPubkey:""}`,
            active: true,
          },
        ]}
      />
    <Profile id={currentPubkey?currentPubkey:""}/>
    </div>
  );
}
