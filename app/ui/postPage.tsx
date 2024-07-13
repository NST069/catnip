"use client";
import moment from "moment";
import React, { useState, useEffect, useActionState } from "react";

import { Post, Tag, Profile, Reaction, Comment } from "@/app/lib/definitions";
import {
  GetProfile,
  GetPostById,
  GetReactions,
  GetComments,
  LeaveLike,
  GetCurrentAccount,
} from "@/app/lib/nostr";
import Link from "next/link";
import CommentCard from "@/app/ui/comment";
import PostForm from "@/app/ui/postForm";

export default function PostPage({ id }: { id: string }) {
  const [post, setPost] = useState<Post>();
  const [reactions, setReactions] = useState<Reaction[]>();
  const [comments, setComments] = useState<Comment[]>();
  type ReactionCnt = { type: string; count: number; emoji: string | undefined };
  const [countedReactions, setCountedReactions] = useState<ReactionCnt[]>();
  const [replyFormActive, setReplyFormActive] = useState<boolean>(false);
  useEffect(() => {
    let fetch = async () => {
      setPost(await GetPostById(id));
      setReactions(await GetReactions(id));
      setComments(await GetComments(id));
    };
    fetch();
  }, []);
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
    <div className="bg-slate-800 p-8 shadow-md my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img
            src={post?.authorAvatar}
            alt={post?.authorName + "Avatar"}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <Link
              href={`/social/profile/${post?.authorId}`}
              className="text-slate-200 font-semibold"
            >
              {post?.authorName}
            </Link>
            <br />
            <p className="group relative inline-block text-slate-400 text-sm duration-300">
              {moment.unix(post?.createdAt as number).fromNow()}
              <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                {moment.unix(post?.createdAt as number).toLocaleString()}
              </span>
            </p>
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
      <div className="flex items-center justify-between">
        <div
          className={`group relative inline-block duration-300 ${
            reactions?.filter((r) => r.userId === GetCurrentAccount()?.pubkey)
              ?.length
              ? "text-slate-300"
              : "text-slate-500"
          }`}
        >
          <div className="flex items-center space-x-2 ">
            <button
              className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1"
              onClick={() =>
                LeaveLike(
                  "❤️",
                  post?.id as string,
                  post?.authorId as string,
                  "1"
                )
              }
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
              {countedReactions?.map((r) => (
                <span className="flex flex-row">
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
        <button
          className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1 text-slate-500"
          onClick={() => setReplyFormActive(!replyFormActive)}
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
        </button>
      </div>
      <hr className="mt-2 mb-2" />
      <p className="text-slate-300 font-semibold">Comments</p>
      {replyFormActive ? (
        <PostForm
          type="Comment"
          commentAttributes={{
            root: post?.id as string,
            reply: "",
            replyTo: post?.authorId as string,
          }}
        />
      ) : null}
      <hr className="mt-2 mb-2" />
      <div className="mt-4">
        {comments
          ?.filter((c) => !c.reply || c.reply === c.root)
          .map((c) => (
            <CommentCard comment={c} commentList={comments} key={c.postId} />
          ))}
      </div>
    </div>
  );
}
