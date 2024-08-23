"use client";
import { Channel } from "@/app/lib/definitions";
import { GetChannelById } from "@/app/lib/nostr";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
      href={`/channel/${nip19.neventEncode({id:channelId} as nip19.EventPointer)}`}
    >
      {channel?.picture ? (
        <img
          className="w-10 h-10 rounded-full"
          src={channel.picture as string}
          alt={`${channel.name} Picture`}
        />
      ) : (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
          {(channel?.name ? channel.name : "Anonymous")?.charAt(0)}
        </div>
      )}
      <div className="font-semibold">
        <div className="ml-2 text-sm">{channel?.name}</div>
      </div>
    </Link>
  );
}
