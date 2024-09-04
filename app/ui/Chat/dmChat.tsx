"use client";
import { useState, useEffect, LegacyRef, useRef } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";

import ChatBubble from "@/app/ui/Chat/chatBubble";
import DMForm from "@/app/ui/Chat/dmForm";

import { DM_Chat, Profile } from "@/app/lib/definitions";
import { GetDM, GetProfile } from "@/app/lib/nostr";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>();
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef as LegacyRef<HTMLDivElement>} />;
};

export default function DMChat({ chatId }: { chatId: string }) {
  const [chat, setChat] = useState<DM_Chat>();
  const [profile, setProfile] = useState<Profile>();
  const [update, setUpdate] = useState<boolean>(false);

  let updateChat = async () => {
    let chats = await GetDM(chatId);
    GetProfile(chatId, setProfile);
    if (chats) setChat(chats[0]);
    else setChat({ chatId, messages: [] } as DM_Chat);
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await updateChat();
      setUpdate(!update);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    updateChat();
  }, []);

  return (
    <div className="flex flex-col flex-auto h-full p-2 bg-slate-900">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-slate-800 h-full p-4">
        <Link
          href={
            profile
              ? `/profile/${nip19.nprofileEncode({
                pubkey: profile.id,
              } as nip19.ProfilePointer)}`
              : "#"
          }
          className="flex flex-row bg-slate-800 items-center mb-2"
        >
          <Avatar id={profile?.id} size={10} rounded src={profile?.picture as string} alt={profile?.name + " Avatar"} />
          <div className="font-semibold text-center flex-1 text-lg text-slate-300" >{profile?.name}</div>
        </Link>
        <hr />
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            {chat ? chat.messages.map((m, ind) => <ChatBubble message={m} key={ind} />) : null}
          </div>
          <AlwaysScrollToBottom />
        </div>
        <DMForm chatId={chatId} updateChat={updateChat} />
      </div>
    </div>
  );
}
