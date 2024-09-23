"use client";

import React, { useState, useEffect } from "react";

import Avatar from "@/app/ui/Components/Avatar";
import MenuItem from "@/app/ui/Components/MenuItem";

import { Profile } from "@/app/lib/definitions";
import { GetProfile, GetCurrentAccount, LogOut } from "@/app/lib/nostr";

export default function Sidebar() {
  const [user, setUser] = useState<Profile>();
  const [update, setUpdate] = useState<boolean>(true);

  let updateSidebar = async () => {
    let currentAccount = GetCurrentAccount();
    await GetProfile(currentAccount ? currentAccount.pubkey : "", setUser);
  };

  useEffect(() => {
    const id = setInterval(async () => {
      if (user?.id !== GetCurrentAccount()?.pubkey) await updateSidebar();
      setUpdate(!update);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    updateSidebar();
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

              <div className="flex items-center gap-4 mx-4">
                <Avatar id={user?.id} size={12} rounded src={user?.picture as string} alt={user?.name + " Avatar"} />
                {user ? (<div className="font-medium">
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
                ) : (
                  <div className="flex-grow w-full">
                    <h1 className="w-3/5 h-2 mt-4 bg-slate-200 rounded-lg dark:bg-slate-700"></h1>
                    <p className="w-auto h-2 mt-4 bg-slate-200 rounded-lg dark:bg-slate-700"></p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5">
            {!user ? (
              <MenuItem href="/signin" caption="Sign In" />
            ) : null}
            <MenuItem href="/feed" caption="Feed" />
            <MenuItem href="/profile" caption="Profile" />
            <MenuItem href="/chat" caption="Messages" />
            <MenuItem href="/channel" caption="Channels" />
            <MenuItem disabled caption="Notifications" />
            <MenuItem href="/settings" caption="Settings" />
            {user ? (
              <MenuItem caption="Log Out" action={() => {
                LogOut();
                updateSidebar();
              }} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
