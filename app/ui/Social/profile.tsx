"use client";

import ProfileCard from "@/app/ui/Social/profileCard";
import Posts from "@/app/ui/Social/posts";
import Follows from "@/app/ui/Social/followsList";
import Relays from "@/app/ui/Social/relayList";

import { useState, useEffect } from "react";

import {
  GetProfile,
  GetPosts,
  GetRelays,
  GetFollows,
  GetCurrentAccount,
  GetPostCount,
} from "@/app/lib/nostr";
import { Profile, Post, Relay } from "@/app/lib/definitions";

export default function ProfilePage({ id }: { id: string | undefined }) {
  const [user, setUser] = useState<Profile>();
  const [relays, setRelays] = useState<Relay[]>();
  const [follows, setFollows] = useState<string[]>();
  const [scope, setScope] = useState<string>("Posts");
  const [pubkey, setPubkey] = useState<string>();
  const [postCount, setPostCount] = useState<number>(0);

  useEffect(() => {
    let currentPubKey = GetCurrentAccount()?.pubkey;
    setPubkey(id ? id : currentPubKey ? currentPubKey : "");
    let fetch = async () => {
      if (!user)
        await GetProfile(id ? id : currentPubKey ? currentPubKey : "", setUser);
      await GetPostCount(
        id ? id : currentPubKey ? currentPubKey : "",
        setPostCount
      );
      await GetRelays(id ? id : currentPubKey ? currentPubKey : "", setRelays);
      await GetFollows(
        id ? id : currentPubKey ? currentPubKey : "",
        setFollows
      );
    };
    fetch();
  }, []);

  return (
    <main className="flex flex-col bg-slate-950">
      <ProfileCard user={user} />
      <div className="flex ">
        <div
          className={`flex flex-1 items-center justify-center h-8 text-sm font-medium ${
            scope === "Posts" ? "bg-slate-800" : "bg-slate-900"
          } hover:bg-slate-800 focus:outline-none`}
          onClick={() => setScope("Posts")}
        >
          Posts {postCount}
        </div>
        <div
          className={`flex flex-1 items-center justify-center h-8 text-sm font-medium ${
            scope === "Follows" ? "bg-slate-800" : "bg-slate-900"
          } hover:bg-slate-800 focus:outline-none`}
          onClick={() => setScope("Follows")}
        >
          Follows: {follows ? follows?.length : 0}
        </div>
        <div
          className={`flex flex-1 items-center justify-center h-8 text-sm font-medium ${
            scope === "Relays" ? "bg-slate-800" : "bg-slate-900"
          } hover:bg-slate-800 focus:outline-none`}
          onClick={() => setScope("Relays")}
        >
          Relays: {relays ? relays?.length : 0}
        </div>
      </div>
      {(() => {
        switch (scope) {
          case "Posts":
            return <Posts pubkey={pubkey as string} />;
          case "Follows":
            return <Follows follows={follows} />;
          case "Relays":
            return <Relays relays={relays} />;
        }
      })()}
    </main>
  );
}
