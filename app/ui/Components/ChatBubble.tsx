import { useEffect, useState } from "react";

import Avatar from "@/app/ui/Components/Avatar";
import RelativeDate from "@/app/ui/Components/RelativeDate";

import { Profile, Message } from "@/app/lib/definitions";
import { DecryptDM, GetProfile } from "@/app/lib/nostr";

export default function ChatBubble({ message }: { message: Message }) {
  const [msg, setMsg] = useState<string>(message.content);
  const [profile, setProfile] = useState<Profile>();
  useEffect(() => {
    let fetch = async () => {
      GetProfile(message.from, setProfile);
      if (message.type === "chat") {
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
        <RelativeDate timestamp={message?.createdAt} />
      </div>
    </div>
  );
}
