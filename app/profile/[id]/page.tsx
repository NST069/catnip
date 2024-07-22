import { notFound } from "next/navigation";
import Profile from "@/app/ui/Social/profile";
import { nip19 } from "nostr-tools";

export default function Page({ params }: { params: { id: string } }) {
  let hexid = "";
  if (nip19.decode(params.id).type === "npub") {
    hexid = nip19.decode<"npub">(params.id as `npub1${string}`).data;
  } else if (nip19.decode(params.id).type === "nprofile") {
    hexid = nip19.decode<"nprofile">(params.id as `nprofile1${string}`).data
      .pubkey;
  } else {
    notFound();
  }

  return (
    <div>
      <Profile id={hexid} />
    </div>
  );
}
