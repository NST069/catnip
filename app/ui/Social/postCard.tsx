"use client";
import moment from "moment";
import React, { useState, useEffect, useActionState } from "react";

import { Post, Tag, Profile, Reaction, Comment } from "@/app/lib/definitions";
import {
  GetProfile,
  GetPostById,
  GetReactions,
  GetComments,
  GetCurrentAccount,
  LeaveLike,
} from "@/app/lib/nostr";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import Image from "next/image";

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
          {profile?.picture ? (
            <img
              src={profile?.picture}
              alt={profile?.name + "Avatar"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700" />
          )}
          <div>
            <Link
              href={post?.authorId?`/profile/${nip19.nprofileEncode({
                pubkey: post?.authorId,
              } as nip19.ProfilePointer)}`:"#"}
              className="text-slate-200 font-semibold"
            >
              {profile ? profile.name : "Anonymous"}
            </Link>
            <br />
            <Link
              href={post?.id?`/post/${nip19.noteEncode(post?.id as string)}`:"#"}
              className="group relative inline-block text-slate-400 text-sm duration-300"
            >
              {moment.unix(post?.createdAt as number).fromNow()}
              <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                {moment.unix(post?.createdAt as number).toLocaleString()}
              </span>
            </Link>
          </div>
        </div>
        <div className="text-gray-500 cursor-pointer">
          <button className="hover:bg-slate-700 rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mb-4">
        <p
          className="text-slate-400"
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {post?.content}
        </p>
        <div className="flex flex-wrap">
          {post?.tags?.map((t) => (
            <span
              key={post.id + "_" + t.value}
              className="bg-slate-100 text-slate-800 text-xs font-medium me-2 mt-2 px-2.5 py-0.5 rounded-full dark:bg-slate-700 dark:text-slate-300"
            >
              #{t.value}
            </span>
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
              className={`flex justify-center items-center gap-2 px-2 hover:bg-slate-700 ${
                reactions?.filter(
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
              <svg
                className="w-5 h-5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
              </svg>
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
          href={post?.id?`/post/${nip19.noteEncode(post?.id as string)}`:"#"}
          className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1"
        >
          <svg
            width="22px"
            height="22px"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"
              ></path>
            </g>
          </svg>
          <span>{comments ? comments.length : 0}</span>
        </Link>
      </div>
    </div>
  );
}
