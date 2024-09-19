import { useEffect, useState } from "react";
import moment from "moment";

import Avatar from "@/app/ui/Components/Avatar";

import { Profile, Message } from "@/app/lib/definitions";
import { DecryptDM, GetProfile } from "@/app/lib/nostr";

export default function ChatBubble({ message }: { message: Message }) {
  const [msg, setMsg] = useState<string>(message.content);
  const [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    let fetch = async () => {
      GetProfile(message.from, setProfile);
      if(message.type === "chat") {
        let decrypted = await DecryptDM(message);
        if (decrypted) setMsg(decrypted);
      }
    };
    fetch();
  }, []);
  return (
    <div className="p-3 rounded-lg text-slate-300">
      <div
        className={`flex ${message.kind == "I" ? "flex-row" : "flex-row-reverse"
          } items-center`}
      >
          <Avatar id={profile?.id} size={10} rounded src={profile?.picture as string} alt={profile?.name + " Avatar"} />
        <div
          className={`relative mx-3 text-sm ${message.kind == "I" ? "bg-slate-700" : "bg-slate-600"
            } py-2 px-4 shadow rounded-xl`}
        >
          <span>{profile?.name ? profile.name : "Anonymous"}</span>
          <hr />
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {msg}
          </div>
        </div>
        <p className="group relative inline-block text-slate-400 text-sm duration-300">
          {moment.unix(message?.createdAt as number).fromNow()}
          <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
            {moment.unix(message?.createdAt as number).toLocaleString()}
          </span>
        </p>
      </div>
    </div>
  );
}
