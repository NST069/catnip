import { useState, useEffect } from "react";
import { GetProfile, GetPosts, GetCurrentAccount, SubmitPost } from "@/app/lib/nostr";
import { Profile, Post } from "@/app/lib/definitions";

import PostForm from "@/app/ui/postForm";
import PostCard from "@/app/ui/postCard";

export default function Posts({
  posts,
  defaultUser,
}: {
  posts: string[] | undefined;
  defaultUser: Profile | undefined;
}) {
  const [postFormActive, setPostFormActive] = useState<boolean>(false);
  
  return (
    <div className="px-9">
      <div
        className="flex flex-1 items-center h-8 hover:bg-slate-700 text-sm px-3 justify-center font-medium"
        onClick={() => setPostFormActive(!postFormActive)}
      >
        New Post
      </div>

      {postFormActive ? <PostForm type="Post"/> : null}
      {posts?.map((el, ind) => {
        return (
          <PostCard /*post={el} defaultUser={defaultUser}*/ id={el} key={el} />
        );
      })}
    </div>
  );
}
