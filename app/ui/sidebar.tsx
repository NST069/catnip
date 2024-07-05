"use client";

import React, { useState, useEffect } from "react";
import { GetProfile } from "@/app/lib/nostr";
import { Profile } from "@/app/lib/definitions";

export default function Sidebar() {
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    let fetch = async () => {
      setUser(
        await GetProfile(
          "f13c62c272f9a34a55882255a5b4ab3992ad1be8a523c6666a50c511bab5480e"
        )
      );
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col flex-shrink-0 w-64 bg-slate-900">
      <div className="flex-shrink-0 relative text-sm focus:outline-none group">
        <div className="flex items-center justify-center w-full h-16 px-4 border-b border-slate-800 bg-slate-700">
          <img
            className="block h-14 w-auto"
            src="/logo_simplified.png"
            alt="Catnip Logo"
          />
          <span className="text-slate-200 inline-flex items-center justify-center px-3 py-2 border border-transparent text-lg font-medium">
            CATNIP
          </span>
        </div>
      </div>
      <div className="h-0 overflow-auto flex-grow">
        <div className="mt-3 mb-3 flex flex-col w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center text-slate-500">
              {user ? (
                <div className="flex items-center gap-4 mx-4">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={user?.picture}
                    alt=""
                  />

                  <div className="font-medium">
                    <div>{user?.name}</div>
                    <div className="text-sm text-slate-300">
                      <p>
                        {user?.npub
                          ? user?.npub.substring(0, 8) +
                            "..." +
                            user?.npub.substring(user.npub.length - 8)
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 mx-4 animate-pulse">
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
                    <p className="w-auto h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                  </div>
                </div>
              )}
              <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
                New Post
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
              Home
            </div>
            <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
              Messages
            </div>
            <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
              Notifications
            </div>
            <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
              Relays
            </div>
            <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
              Settings
            </div>
            <div className="flex items-center h-8 hover:bg-slate-700 text-sm px-3">
              Log Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
