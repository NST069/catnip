import React, { useState, useEffect } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";

import { Profile } from "@/app/lib/definitions";
import { GetProfile } from "@/app/lib/nostr";

export default function ProfileCardSmall({ id }: { id: string }) {
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    let fetch = async () => {
      if (!user) await GetProfile(id, setUser);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-start text-slate-500">

      <Link
        className="flex items-center gap-4 ml-12"
        href={user ? `/profile/${nip19.nprofileEncode({
          pubkey: user.id,
        } as nip19.ProfilePointer)}` : "#"}
      >
        <Avatar id={user?.id} size={16} rounded src={user?.picture as string} alt={user?.name + " Profile Picture"} />

        {user ?
          <div className="font-medium">
            <div>{user?.name}</div>
            <div className="text-sm text-slate-300">
              <p className="text-sm text-slate-400">
                {user?.npub
                  ? user?.npub.substring(0, 8) +
                  "..." +
                  user?.npub.substring(user.npub.length - 8)
                  : ""}
              </p>
              <p className="text-sm text-slate-400">{user.nip05}</p>
              <p className="text-sm text-slate-400">{user.website}</p>
            </div>
          </div>
          :
          <div className="flex-grow w-full animate-pulse">
            <h1 className="w-3/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
            <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
          </div>
        }
      </Link>
    </div>
  );
}
