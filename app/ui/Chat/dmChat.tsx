"use client";
import { DM_Chat } from "@/app/lib/definitions";
import { GetDM } from "@/app/lib/nostr";
import ChatBubble from "@/app/ui/Chat/chatBubble";
import { useState, useEffect, LegacyRef, useRef } from "react";
import DMForm from "@/app/ui/Chat/dmForm";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>();
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef as LegacyRef<HTMLDivElement>} />;
};

export default function DMChat({ chatId }: { chatId: string }) {
  const [chat, setChat] = useState<DM_Chat>();
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    let fetch = async () => {};
    fetch();
  }, []);

  let updateChat = async () => {
    let chats = await GetDM(chatId);
    console.log(chats);
    if (chats) setChat(chats[0]);
    else setChat({ chatId, messages: [] } as DM_Chat);
    console.log(chat);
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
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            {chat ? chat.messages.map((m) => <ChatBubble message={m} />) : null}
          </div>
          <AlwaysScrollToBottom />
        </div>
        <DMForm chatId={chatId} updateChat={updateChat} />
      </div>
    </div>
  );
}
