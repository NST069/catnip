"use client";
import React, { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";
import Hashtag from "@/app/ui/Components/Hashtag";
import RelativeDate from "@/app/ui/Components/RelativeDate";
import Paragraph from "@/app/ui/Components/Paragraph";

import { Post, Tag, Profile, Reaction, Comment } from "@/app/lib/definitions";
import {
  GetProfile,
  GetPostById,
  GetReactions,
  GetComments,
  GetCurrentAccount,
  LeaveLike,
} from "@/app/lib/nostr";
import { Chat, Heart, ThreeDots } from "@/app/lib/iconset";

export default function PostCard({ initialPost }: { initialPost: Post }) {
  const [post, setPost] = useState<Post>();
  const [profile, setProfile] = useState<Profile>();
  const [reactions, setReactions] = useState<Reaction[]>();
  const [comments, setComments] = useState<Comment[]>();
  const [update, setUpdate] = useState<boolean>(true);
  type ReactionCnt = { type: string; count: number; emoji: string | undefined };
  const [countedReactions, setCountedReactions] = useState<ReactionCnt[]>();
  // useEffect(() => {
  //   let fetch = async () => {
  //     setPost(initialPost);
  //     await GetProfile(post?.authorId as string, setProfile);
  //     setReactions(await GetReactions(post?.id as string));
  //     setComments(await GetComments(post?.id as string));

  //   };
  //   fetch();
  // }, []);
  useEffect(() => {
    setPost(initialPost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let updatePost = async () => {
    if (post) {
      setPost(await GetPostById(post.id as string));
      await GetProfile(post?.authorId as string, setProfile);
      setReactions(await GetReactions(post?.id as string));
      setComments(await GetComments(post?.id as string));
    }
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await updatePost();
      setUpdate(!update);
    }, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    setCountedReactions(
      reactions
        ?.reduce<ReactionCnt[]>((acc: ReactionCnt[], val) => {
          let a = acc.find((a) => a.type == val.content);
          if (a === undefined)
            acc.push({ type: val.content, count: 1, emoji: val.emoji });
          else acc[acc.indexOf(a)].count += 1;
          return acc;
        }, [])
        .sort((a, b) => b.count - a.count)
    );
  }, [reactions]);

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-md my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Avatar id={profile?.id} size={8} rounded src={profile?.picture as string} alt={profile?.name + "Avatar"} />
          <div>
            <Link
              href={post?.authorId ? `/profile/${nip19.nprofileEncode({
                pubkey: post?.authorId,
              } as nip19.ProfilePointer)}` : "#"}
              className="text-slate-200 font-semibold"
            >
              {profile ? profile.name : "Anonymous"}
            </Link>
            <br />
            <RelativeDate timestamp={post?.createdAt} url={post?.id ? `/post/${nip19.noteEncode(post?.id as string)}` : "#"} />
          </div>
        </div>
        <div className="text-gray-500 cursor-pointer">
          <button className="hover:bg-slate-700 rounded-full p-1">
            <ThreeDots />
          </button>
        </div>
      </div>
      <div className="mb-4">
        <Paragraph content={post?.content} />
        <div className="flex flex-wrap">
          {post?.tags?.map((t) => (
            <Hashtag tag={t.value} keystring={post.id + "_" + t.value} />
          ))}
        </div>
      </div>
      <div className="mb-4">
        {/*<img
          src="/postimage.png"
          alt="Post Image"
          className="object-scale-down rounded-md"
        />*/}
      </div>
      <div className="flex items-center justify-between text-slate-500">
        <div className="group relative inline-block duration-300">
          <div className="flex items-center space-x-2">
            <button
              className={`flex justify-center items-center gap-2 px-2 hover:bg-slate-700 ${reactions?.filter(
                (r) => r.userId === GetCurrentAccount()?.pubkey
              )?.length
                ? "text-slate-300"
                : "text-slate-500"
                } rounded-full p-1`}
              onClick={async () => {
                await LeaveLike(
                  "❤️",
                  post?.id as string,
                  post?.authorId as string,
                  "1"
                );
                updatePost();
              }}
            >
              <Heart/>
              <span>{reactions ? reactions.length : 0}</span>
            </button>
          </div>
          {reactions ? (
            <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
              {countedReactions?.map((r, ind) => (
                <span className="flex flex-row" key={ind}>
                  {r.emoji ? (
                    <img className="h-4 w-4" src={r.emoji} alt={r.type} />
                  ) : (
                    r.type
                  )}
                  : {r.count}
                </span>
              ))}
            </span>
          ) : null}
        </div>
        <Link
          href={post?.id ? `/post/${nip19.noteEncode(post?.id as string)}` : "#"}
          className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1"
        >
          <Chat/>
          <span>{comments ? comments.length : 0}</span>
        </Link>
      </div>
    </div>
  );
}
