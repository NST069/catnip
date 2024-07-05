"use client";

import ProfileCard from "@/app/ui/profileCard";
import PostCard from "@/app/ui/postCard";

import { useState, useEffect } from "react";

import { GetProfile, GetPosts } from "@/app/lib/nostr";
import { Profile, Post } from "@/app/lib/definitions";

export default function ProfilePage({ id }: { id: string }) {

  const [user, setUser] = useState<Profile>();
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    let fetch = async () => {
      setUser(await GetProfile(id));
      setPosts(await GetPosts(id));
    };
    fetch();
  }, []);

  return (
    <main className="flex flex-col bg-slate-950">
      <ProfileCard user={user} />
      <div className="px-9">
        {posts?.map((el, ind) => {
          return <PostCard post={el} defaultUser={user} key={el.id}/>;
        })}
      </div>
    </main>
  );
}
