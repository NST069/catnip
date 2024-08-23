"use client";
import { Channel } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { GetChannelById, GetChannels } from "@/app/lib/nostr";
import ChannelProfile from "./channelProfile";

export default function ChannelSidebar() {
  //const [channels, setChannels] = useState<Channel[]>();
  const [channels, setChannels] = useState<string[]>();
  const [selectedChannelId, setSelectedChannelId] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  let updateChannels = async () => {
    setChannels(await GetChannels());
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await updateChannels();
      setUpdate(!update);
    }, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    updateChannels();
  }, []);

  return (
    <div className="flex flex-col py-4 px-4 w-64 bg-slate-900 text-slate-300 flex-shrink-0">
      <div className="flex flex-col mt-4">
        <div className="flex flex-row items-center justify-between text-sm">
          <span className="font-bold text-slate-200">Conversations</span>
          <span className="flex items-center justify-center bg-slate-800 h-4 w-4 rounded-full">
            {channels ? channels.length : 0}
          </span>
        </div>
        <div className="flex flex-col space-y-1 mt-4 -mx-2 overflow-y-auto">
          {channels
            ? channels.map((c, ind) => (<ChannelProfile
              channelId={c}
              setSelectedChannelId={setSelectedChannelId}
              isSelected={selectedChannelId === c}
              key={ind}
            />
            ))
            : null}
        </div>
      </div>
    </div>
  );
}
