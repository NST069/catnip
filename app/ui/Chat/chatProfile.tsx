"use client";
import { DM_Chat, Profile } from "@/app/lib/definitions";
import { GetProfile } from "@/app/lib/nostr";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function ChatProfile({
  chat,
  setSelectedChatId,
  isSelected,
}: {
  chat: DM_Chat;
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
      className={`flex flex-row items-center hover:bg-slate-800 p-2 ${
        isSelected ? "bg-slate-800" : "bg-slate-900"
      }`}
      href={`/chat/${nip19.npubEncode(chat.chatId)}`}
    >
      {profile?.picture ? (
        <img
          className="w-10 h-10 rounded-full"
          src={profile?.picture as string}
          alt={`${profile.name} Picture`}
        />
      ) : (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
          {(profile ? profile.name : "Anonymous")?.charAt(0)}
        </div>
      )}
      <div className="font-semibold">
        <div className="ml-2 text-sm">{profile?.name}</div>
      </div>
    </Link>
  );
}
