"use client";
import { Channel } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { GetChannelById, GetChannels } from "@/app/lib/nostr";
import ChannelProfile from "./channelProfile";

export default function ChannelSidebar() {
  const [channels, setChannels] = useState<Channel[]>();
  const [selectedChannelId, setSelectedChannelId] = useState<string>();
  const [update, setUpdate] = useState<boolean>(false);

  let updateChannels = async () => {
    //setChannels(await GetChannels());
    let a: Channel[] = [];
    let c1 = await GetChannelById(
      "2bf5660565f348d1e61c3cf8892786ed33c1fbbdfe59b212fe747d647e43bbcc"
    );
    c1 ? a.push(c1 as Channel) : null;
    let c2 = await GetChannelById(
      "79ae22565eb31f472837fda183e18519b71a9e6beead422d4b3b0bfa98f5f992"
    );
    c2 ? a.push(c2 as Channel) : null;
    let c3 = await GetChannelById(
      "37d2d5c5970f660eadb0f8f9e9f11b1230af9451134307c907369f423279d92d"
    );
    c3 ? a.push(c3 as Channel) : null;
    console.log(a);
    setChannels(a.filter((a) => a.channelId));
    console.log(channels);
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
            ? channels.map((c, ind) => (
                <ChannelProfile
                  channel={c}
                  setSelectedChannelId={setSelectedChannelId}
                  isSelected={selectedChannelId === c.channelId}
                  key={ind}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
