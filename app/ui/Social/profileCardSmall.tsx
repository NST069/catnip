import React, { useState, useEffect } from "react";
import Link from "next/link";

import { GetProfile } from "@/app/lib/nostr";
import { Profile } from "@/app/lib/definitions";
import { nip19 } from "nostr-tools";
import Image from "next/image";

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
      {user ? (
        <Link
          className="flex items-center gap-4 ml-12"
          href={`/profile/${nip19.nprofileEncode({
            pubkey: user.id,
          } as nip19.ProfilePointer)}`}
        >
          <img className="w-16 h-16 rounded-full" src={user?.picture as string} alt="Profile Picture" />

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
        </Link>
      ) : (
        <div className="flex items-center gap-4 ml-12 animate-pulse">
          <div className="grid bg-slate-800 rounded-full h-12 w-12 place-items-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              ></path>
            </svg>
          </div>
          <div className="flex-grow w-full">
            <h1 className="w-3/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
            <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
            <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
          </div>
        </div>
      )}
    </div>
  );
}
