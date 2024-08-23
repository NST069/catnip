"use client";
import { Channel, ChannelMessage } from "@/app/lib/definitions";
import { useState, useEffect, useRef, LegacyRef } from "react";
import { GetChannelById, GetChannelMessages } from "@/app/lib/nostr";
import ChannelBubble from "@/app/ui/Chat//channelBubble";
import ChannelForm from "@/app/ui/Chat/channelForm";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>();
  useEffect(() => elementRef.current?.scrollIntoView());
  return <div ref={elementRef as LegacyRef<HTMLDivElement>} />;
};

export default function DMChannel({ channelId }: { channelId: string }) {
  const [channel, setChannel] = useState<Channel>();
  const [messages, setMessages] = useState<ChannelMessage[]>();
  const [update, setUpdate] = useState<boolean>(false);

  let updateChannel = async () => {
    await GetChannelById(channelId, setChannel);
    await GetChannelMessages(channelId, setMessages);
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await updateChannel();
      setUpdate(!update);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    updateChannel();
  }, []);
  return (
    <div className="flex flex-col flex-auto h-full p-2 bg-slate-900">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-slate-800 h-full p-4">
        <div className="flex flex-row bg-slate-800 items-center mb-2">
          {channel?.picture ? (
            <img
              className="w-10 h-10 rounded-full"
              src={channel?.picture as string}
              alt={`${channel.name} Picture`}
            />
          ) : (
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-500 flex-shrink-0">
              {(channel ? channel.name : "Anonymous")?.charAt(0)}
            </div>
          )}
          <div className="font-semibold text-center flex-1 text-lg text-slate-300" >{channel?.name}</div>
        </div>
        <hr />
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            {messages
              ? messages.map((m, ind) => <ChannelBubble message={m} key={ind} />)
              : null}
            <AlwaysScrollToBottom />
          </div>
        </div>
        <ChannelForm channelId={channelId} updateChannel={updateChannel} />
      </div>
    </div>
  );
}
