import DMChannel from "@/app/ui/Chat/dmChannel";
import { notFound } from "next/navigation";
import { nip19 } from "nostr-tools";

export default function Chat({ params }: { params: { id: string } }) {
  let hexid = "";
  if (nip19.decode(params.id).type === "nevent") {
    hexid = nip19.decode<"nevent">(params.id as `nevent1${string}`).data.id;
  } else {
    notFound();
  }
  return <DMChannel channelId={hexid} />;
}
