import { useState, useEffect } from "react";
import Link from "next/link";

import Avatar from "@/app/ui/Components/Avatar";

import { Profile } from "@/app/lib/definitions";
import {
  GetProfile,
  GetFollows,
  ToggleFollowing,
  CheckFollow,
} from "@/app/lib/nostr";
import { ImagePlaceholderIcon } from "@/app/lib/iconset";

export default function ProfileCard({ user }: { user: Profile | undefined }) {
  const [npub, setNpub] = useState<string>("");
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  useEffect(() => {
    setNpub(
      user?.npub?.substring(0, 8) +
      "..." +
      user?.npub?.substring(user?.npub?.length - 8)
    );
    CheckFollow(user?.id as string, setIsFollowed);
  }, [user]);

  return (
    <div>
      {user ? (
        <div className="border-b-4 border-slate-900">
          {user.banner ? (
            <div className="w-full h-60 overflow-hidden">
              <img
                className="object-cover object-center"
                src={user?.banner}
                alt={user?.name + " banner"}
              />
            </div>
          ) : (
            <div className="grid w-full h-60 bg-slate-800 place-items-center flex-shrink-0">
              <ImagePlaceholderIcon size={24} />
            </div>
          )}
          <div className="flex flex-row">
            <div className="mx-16 w-64 h-64 relative -mt-32 border-4 border-slate-950 rounded-full overflow-hidden flex-shrink-0">
              <Avatar id={user?.id} size={64} rounded src={user?.picture as string} alt={user?.name as string} />
            </div>
            <div className="flex flex-grow justify-between py-4">
              <div className="p-5 text-slate-500">
                <div className="flex items-start">
                  <div className="text-sm">
                    <div className="font-medium leading-none text-slate-200 hover:text-slate-100 transition duration-500 ease-in-out inline-flex items-center justify-center px-3 py-2 border border-transparent text-lg">
                      {user?.name}
                    </div>
                    <p>{user?.nip05}</p>
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
                  </div>
                </div>
              </div>
              <div
                className="inline-flex rounded-md shadow-sm m-5"
                role="group"
              >
                <button
                  onClick={async () => {
                    await ToggleFollowing(user.id, () =>
                      setIsFollowed(!isFollowed)
                    );
                  }}
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-800 hover:border-slate-700 rounded-s-lg"
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </button>
                <Link
                  href={`/chat/${user.npub}`}
                  className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-800 hover:border-slate-700 rounded-e-lg content-center"
                >
                  Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b-4 border-slate-900 animate-pulse">
          <div className="grid w-full h-60 bg-slate-800 place-items-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-24 h-24 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              ></path>
            </svg>
          </div>
          <div className="flex flex-row">
            <div className="grid bg-slate-800 mx-16 w-64 h-64 relative -mt-32 border-4 border-slate-950 rounded-full overflow-hidden place-items-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-12 h-12 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                ></path>
              </svg>
            </div>
            <div className="flex justify-between py-4">
              <div className="p-5 text-slate-500">
                <div className="flex items-start">
                  <div className="text-sm">
                    <p className="w-64 h-6 rounded-lg bg-slate-800 mb-2"></p>
                    <p className="w-64 h-4 rounded-lg bg-slate-800 mb-1"></p>
                    <p className="w-64 h-4 rounded-lg bg-slate-800 mb-1"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
