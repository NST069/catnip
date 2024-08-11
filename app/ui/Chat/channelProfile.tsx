"use client";
import { Channel, DM_Chat, Profile } from "@/app/lib/definitions";
import { GetProfile } from "@/app/lib/nostr";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ChannelProfile({
  channel,
  setSelectedChannelId,
  isSelected,
}: {
  channel: Channel;
  setSelectedChannelId: Dispatch<SetStateAction<string | undefined>>;
  isSelected: boolean;
}) {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    let fetch = async () => await GetProfile(channel.channelId, setProfile);
    fetch();
  }, [channel]);

  return (
    <Link
      onClick={() => setSelectedChannelId(channel.channelId)}
      className={`flex flex-row items-center hover:bg-slate-800 p-2 ${
        isSelected ? "bg-slate-800" : "bg-slate-900"
      }`}
      href={`/channel/${/*nip19.neventEncode(*/channel.channelId/*)*/}`}
    >
      {channel.picture ? (
        <img
          className="w-10 h-10 rounded-full"
          src={channel.picture as string}
          alt={`${channel.name} Picture`}
        />
      ) : (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
          {(channel.name ? channel.name : "Anonymous")?.charAt(0)}
        </div>
      )}
      <div className="font-semibold">
        <div className="ml-2 text-sm">{channel.name}</div>
      </div>
    </Link>
  );
}
