"use client";

import ProfileCard from "@/app/ui/profileCard";
import Posts from "@/app/ui/posts";
import Follows from "@/app/ui/followsList";
import Relays from "@/app/ui/relayList";

import { useState, useEffect } from "react";

import {
  GetProfile,
  GetPosts,
  GetRelays,
  GetFollows,
  GetCurrentAccount,
} from "@/app/lib/nostr";
import { Profile, Post, Relay } from "@/app/lib/definitions";

export default function ProfilePage({ id }: { id: string | undefined }) {
  const [user, setUser] = useState<Profile>();
  const [posts, setPosts] = useState<string[]>();
  const [relays, setRelays] = useState<Relay[]>();
  const [follows, setFollows] = useState<string[]>();
  const [scope, setScope] = useState<string>("Posts");

  useEffect(() => {
    let currentPubKey = GetCurrentAccount()?.pubkey;
    let fetch = async () => {
      if(!user)await GetProfile(id ? id : currentPubKey ? currentPubKey : "", setUser)
      if(!posts)await GetPosts(id ? id : currentPubKey ? currentPubKey : "", setPosts);
      setRelays(await GetRelays(id ? id : currentPubKey ? currentPubKey : ""));
      setFollows(
        await GetFollows(id ? id : currentPubKey ? currentPubKey : "")
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
          Posts: {posts ? posts.length : 0}
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
            return <Posts posts={posts} defaultUser={user} />;
          case "Follows":
            return <Follows follows={follows}/>;
          case "Relays":
            return <Relays relays={relays}/>;
        }
      })()}
    </main>
  );
}
