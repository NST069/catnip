"use client";
import { DM_Chat } from "@/app/lib/definitions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChatProfile from "./chatProfile";
import { GetDM } from "@/app/lib/nostr";

export default function DMSidebar() {
  const [chats, setChats] = useState<DM_Chat[]>();
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    let fetch = async () => {};
    fetch();
  }, []);

  let updateChats = async () => {
    setChats(await GetDM());
    console.log(chats);
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await updateChats();
      setUpdate(!update);
    }, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    updateChats();
  }, []);

  return (
    <div className="flex flex-col py-4 px-4 w-64 bg-slate-900 text-slate-300 flex-shrink-0">
      <div className="flex flex-col mt-4">
        <div className="flex flex-row items-center justify-between text-sm">
          <span className="font-bold text-slate-200">Conversations</span>
          <span className="flex items-center justify-center bg-slate-800 h-4 w-4 rounded-full">
            {chats ? chats.length : 0}
          </span>
        </div>
        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
          {chats
            ? chats.map((c, ind) => (
                <ChatProfile
                  chat={c}
                  setSelectedChatId={setSelectedChatId}
                  isSelected={selectedChatId === c.chatId}
                  key={ind}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
