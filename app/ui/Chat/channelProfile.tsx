"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import Link from "next/link";

import Avatar from "@/app/ui/Components/Avatar";

import { Channel } from "@/app/lib/definitions";
import { GetChannelById } from "@/app/lib/nostr";

export default function ChannelProfile({
  channelId,
  setSelectedChannelId,
  isSelected,
}: {
  //channel: Channel;
  channelId: string;
  setSelectedChannelId: Dispatch<SetStateAction<string | undefined>>;
  isSelected: boolean;
}) {
  const [channel, setChannel] = useState<Channel>();
  const [update, setUpdate] = useState<boolean>();

  let updateChannel = async () => {
    await GetChannelById(channelId, setChannel)
  }

  useEffect(() => {
    if (channel) return;
    const id = setInterval(async () => {
      await updateChannel();
      setUpdate(!update);
    }, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    updateChannel();
  }, []);

  return (
    <Link
      onClick={() => setSelectedChannelId(channelId)}
      className={`flex flex-row items-center hover:bg-slate-800 p-2 ${isSelected ? "bg-slate-800" : "bg-slate-900"
        }`}
      href={`/channel/${nip19.neventEncode({ id: channelId } as nip19.EventPointer)}`}
    >
      <Avatar id={channel?.channelId} size={10} rounded src={channel?.picture as string} alt={channel?.name + " Avatar"} />
      <div className="font-semibold">
        <div className="ml-2 text-sm">{channel?.name}</div>
      </div>
    </Link>
  );
}
