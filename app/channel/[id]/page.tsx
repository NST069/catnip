import DMChannel from "@/app/ui/Chat/dmChannel";
import { notFound } from "next/navigation";
import { nip19 } from "nostr-tools";

export default function Chat({ params }: { params: { id: string } }) {
  // let hexid = "";
  // if (nip19.decode(params.id).type === "npub") {
  //   hexid = nip19.decode<"npub">(params.id as `npub1${string}`).data;
  // } else {
  //   notFound();
  // }
  return <DMChannel channelId={params.id} />;
}
