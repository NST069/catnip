"use client";

import { useState, useEffect } from "react";

import { GetFeed, GetFollows, GetCurrentAccount } from "@/app/lib/nostr";
import { Post } from "@/app/lib/definitions";
import PostCard from "@/app/ui/Social/postCard";

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>();
  const [scope, setScope] = useState<string>("All");

  useEffect(() => {
    let fetch = async () => {
      setPosts([]);
      if (scope === "Follows") {
        let currentAccount = GetCurrentAccount();
        let follows: string[] = currentAccount?(await GetFollows(currentAccount.pubkey) as string[]):[];
        //get follows from logged user
        await GetFeed(setPosts, follows);
      } else await GetFeed(setPosts);
    };
    fetch();
  }, [scope]);

  return (
    <main className="flex flex-col bg-slate-950">
      <div className="flex ">
        <div
          className={`flex flex-1 items-center justify-center h-8 text-sm font-medium ${
            scope === "All" ? "bg-slate-800" : "bg-slate-900"
          } hover:bg-slate-800 focus:outline-none`}
          onClick={() => setScope("All")}
        >
          All
        </div>
        <div
          className={`flex flex-1 items-center justify-center h-8 text-sm font-medium ${
            scope === "Follows" ? "bg-slate-800" : "bg-slate-900"
          } hover:bg-slate-800 focus:outline-none`}
          onClick={() => setScope("Follows")}
        >
          Follows
        </div>
      </div>
      <div className="px-9">
        {posts?.map((el, ind) => {
          return <PostCard initialPost={el} key={el.id} />;
        })}
      </div>
    </main>
  );
}
