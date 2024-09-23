"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import Link from "next/link";

import Avatar from "@/app/ui/Components/Avatar";

import { Chat, Profile } from "@/app/lib/definitions";
import { GetProfile } from "@/app/lib/nostr";

export default function ChatProfile({
  chat,
  setSelectedChatId,
  isSelected,
}: {
  chat: Chat;
  setSelectedChatId: Dispatch<SetStateAction<string | undefined>>;
  isSelected: boolean;
}) {
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    let fetch = async () => await GetProfile(chat.chatId, setProfile);
    fetch();
  }, [chat]);

  return (
    <Link
      onClick={() => setSelectedChatId(chat.chatId)}
      className={`flex flex-row items-center hover:bg-slate-800 p-2 ${isSelected ? "bg-slate-800" : "bg-slate-900"
        }`}
      href={`/chat/${nip19.npubEncode(chat.chatId)}`}
    >
      <Avatar id={profile?.id} size={10} rounded src={profile?.picture as string} alt={profile?.name + " Avatar"} />
      <div className="font-semibold">
        <div className="ml-2 text-sm">{profile?.name}</div>
      </div>
    </Link>
  );
}
