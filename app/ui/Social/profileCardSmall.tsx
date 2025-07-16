import React, { useState, useEffect } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";

import { Profile } from "@/app/lib/definitions";
import { GetProfile } from "@/app/lib/nostr";
import { ImagePlaceholderIcon } from "@/app/lib/iconset";

export default function ProfileCardSmall({ id }: { id: string }) {
  const [user, setUser] = useState<Profile>();
  const [npub, setNpub] = useState<string>();

  useEffect(() => {
    let fetch = async () => {
      if (!user) {
        await GetProfile(id, setUser).then((p) => {
          console.log(p)
          setNpub(p?.npub);
        })
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col text-slate-500 m-4">
      {user ? (
        <div
          className="rounded-2xl border-2 border-slate-800"
        >
          <div className="w-full h-32 overflow-hidden rounded-t-2xl">
            {user.banner ? (
              <img
                className="object-cover object-center overflow-hidden "
                src={user?.banner}
                alt={user?.name + " banner"}
              />)
              : (
                <div className="grid w-full h-32 bg-slate-800 place-items-center flex-shrink-0">
                  <ImagePlaceholderIcon size={6} />
                </div>
              )}
          </div>
          <div className="flex flex-row">
            <div className="mx-16 w-32 h-32 relative -mt-16 border-4 border-slate-950 rounded-full overflow-hidden flex-shrink-0">
              <Avatar id={user?.id} size={32} rounded src={user?.picture as string} alt={user?.name as string} />
            </div>
            <div className="flex flex-grow justify-between py-4">
              <div className="font-medium">
                <Link href={user ? `/profile/${nip19.nprofileEncode({
                  pubkey: user.id,
                } as nip19.ProfilePointer)}` : "#"}>{user?.name}</Link>
                <div className="text-sm text-slate-300">
                  <p className="text-sm text-slate-400">
                    {user?.npub
                      ? user?.npub.substring(0, 8) +
                      "..." +
                      user?.npub.substring(user.npub.length - 8)
                      : ""}
                  </p>
                  <p
                    onMouseEnter={() => setNpub(user.npub)}
                    onMouseLeave={() =>
                      setNpub(
                        user.npub.substring(0, 8) +
                        "..." +
                        user.npub.substring(user?.npub?.length - 8)
                      )
                    }
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {npub}
                  </p>
                  <p className="text-sm text-slate-400">{user.nip05}</p>
                  <p className="text-sm text-slate-400">{user.website}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b-4 border-slate-900 animate-pulse">
          <div className="grid w-full h-32 bg-slate-800 place-items-center flex-shrink-0">
            <ImagePlaceholderIcon size={6} />
          </div>
          <div className="flex flex-row">
            <div className="grid bg-slate-800 mx-16 w-24 h-24 relative -mt-32 border-4 border-slate-950 rounded-full overflow-hidden place-items-center flex-shrink-0">
              <ImagePlaceholderIcon size={4} />
            </div>
            <div className="flex justify-between py-4">
              <div className="flex-grow w-full animate-pulse">
                <h1 className="w-3/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
