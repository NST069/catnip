import { useState, useEffect } from "react";
import {
  GetProfile,
  GetPosts,
  GetCurrentAccount,
  SubmitPost,
} from "@/app/lib/nostr";
import { Profile, Post } from "@/app/lib/definitions";

import PostForm from "@/app/ui/Social/postForm";
import PostCard from "@/app/ui/Social/postCard";

export default function Posts({ pubkey }: { pubkey: string }) {
  const [posts, setPosts] = useState<Post[]>();
  const [update, setUpdate] = useState<boolean>(true);
  const [postFormActive, setPostFormActive] = useState<boolean>(false);

  let updatePosts = async () => {
    await GetPosts(pubkey, setPosts);
  };

  useEffect(() => {
    updatePosts();
  }, [pubkey]);

  useEffect(() => {
    const id = setInterval(async () => {
      await updatePosts();
      setUpdate(!update);
    }, 300000);
    return () => clearInterval(id);
  }, [update]);

  return (
    <div className="px-9">
      <div
        className="flex flex-1 items-center h-8 hover:bg-slate-700 text-sm px-3 justify-center font-medium"
        onClick={() => setPostFormActive(!postFormActive)}
      >
        New Post
      </div>

      {postFormActive ? (
        <PostForm
          type="Post"
          updatePosts={async () => {
            setPostFormActive(false);
            updatePosts();
          }}
        />
      ) : null}
      {posts?.map((el, ind) => {
        return <PostCard initialPost={el} key={el.id} />;
      })}
    </div>
  );
}
