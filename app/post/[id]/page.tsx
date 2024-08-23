"use client";

import { notFound } from "next/navigation";
import PostPage from "@/app/ui/Social/postPage";
import { nip19 } from "nostr-tools";

export default function Post({ params }: { params: { id: string } }) {
  let hexid = "";
  if (nip19.decode(params.id).type === "note") {
    hexid = nip19.decode<"note">(params.id as `note1${string}`).data;
  } else {
    notFound();
  }

  return (
    <div>
      <PostPage id={hexid} />
    </div>
  );
}
