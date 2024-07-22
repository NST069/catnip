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
import PostForm from "@/app/ui/Social/postForm";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import Image from "next/image";

export default function CommentCard({
  comment,
  commentList,
}: {
  comment: Comment;
  commentList: Comment[];
}) {
  const [post, setPost] = useState<Post>();
  const [children, setChildren] = useState<Comment[]>();
  const [reactions, setReactions] = useState<Reaction[]>();
  const [replyFormActive, setReplyFormActive] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(true);

  let updateComments = async () => {
    setPost(await GetPostById(comment.postId));
    setReactions(await GetReactions(comment.postId));
    setChildren(commentList.filter((c) => c.reply == comment.postId));
  };

  useEffect(() => {
    const id = setInterval(async () => {
      await updateComments();
      setUpdate(!update);
    }, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  useEffect(() => {
    setPost(comment);
    updateComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-col w-full mx-auto bg-slate-800 ">
      <div className="flex flex-row">
        <img
          className="object-cover w-12 h-12 border-2 border-slate-900 rounded-full"
          alt={post?.authorName + " avatar"}
          src={post?.authorAvatar as string}
        />
        <div className="flex-col mt-1">
          <Link
            href={
              post?.authorId
                ? `/profile/${nip19.nprofileEncode({
                    pubkey: post?.authorId,
                  } as nip19.ProfilePointer)}`
                : "#"
            }
            className="flex items-center flex-1 px-4 font-bold leading-tight"
          >
            {post?.authorName}
            <span className="group relative inline-block ml-2 text-xs font-normal text-slate-400 duration-300">
              {moment.unix(post?.createdAt as number).fromNow()}
              <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full w-48 px-2 py-1 bg-slate-700 rounded-lg text-center text-slate-300 text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                {moment.unix(post?.createdAt as number).toLocaleString()}
              </span>
            </span>
          </Link>
          <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-slate-300">
            {post?.content}
          </div>
          <button
            className="inline-flex items-center px-1 pt-2 ml-1 flex-column text-slate-500"
            onClick={() => setReplyFormActive(!replyFormActive)}
          >
            <svg
              className={`w-5 h-5 ml-2 ${
                replyFormActive ? "text-slate-400" : "text-slate-600"
              } cursor-pointer fill-current hover:text-slate-400`}
              viewBox="0 0 95 78"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z"
                fillRule="nonzero"
              />
            </svg>
          </button>
          <button
            className={`inline-flex items-center px-1 -ml-1 flex-column ${
              reactions?.filter((r) => r.userId === GetCurrentAccount()?.pubkey)
                ?.length
                ? "text-slate-300"
                : "text-slate-500"
            }`}
            onClick={async () => {
              await LeaveLike(
                "❤️",
                post?.id as string,
                post?.authorId as string,
                "1"
              );
              updateComments();
            }}
          >
            <svg
              className="w-5 h-5 cursor-pointer hover:text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              ></path>
            </svg>
            <span>{reactions ? reactions.length : 0}</span>
          </button>
        </div>
      </div>
      {replyFormActive ? (
        <PostForm
          type="Comment"
          updatePosts={async () => {
            updateComments();
            setReplyFormActive(false);
          }}
          commentAttributes={{
            root: comment.root as string,
            reply: post?.id as string,
            replyTo: post?.authorId as string,
          }}
        />
      ) : null}
      <hr className="my-2 ml-16 border-slate-700" />
      {children ? (
        <div className="flex flex-col pt-1 ml-4">
          {children.map((c) => (
            <CommentCard comment={c} commentList={commentList} key={c.postId} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
