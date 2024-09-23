"use client";
import React, { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";
import Hashtag from "@/app/ui/Components/Hashtag";
import RelativeDate from "@/app/ui/Components/RelativeDate";
import Paragraph from "@/app/ui/Components/Paragraph";

import CommentCard from "@/app/ui/Social/comment";
import PostForm from "@/app/ui/Social/postForm";

import { Post, Tag, Profile, Reaction, Comment } from "@/app/lib/definitions";
import {
  GetProfile,
  GetPostById,
  GetReactions,
  GetComments,
  LeaveLike,
  GetCurrentAccount,
} from "@/app/lib/nostr";
import { Chat, Heart, ThreeDots } from "@/app/lib/iconset";

export default function PostPage({ id }: { id: string }) {
  const [post, setPost] = useState<Post>();
  const [reactions, setReactions] = useState<Reaction[]>();
  const [comments, setComments] = useState<Comment[]>();
  type ReactionCnt = { type: string; count: number; emoji: string | undefined };
  const [countedReactions, setCountedReactions] = useState<ReactionCnt[]>();
  const [replyFormActive, setReplyFormActive] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(true);

  let updatePost = async () => {
    setPost(await GetPostById(id));
    setReactions(await GetReactions(id));
    setComments(await GetComments(id));
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
    updatePost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="bg-slate-800 p-8 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Avatar id={post?.authorId} size={12} rounded src={post?.authorAvatar as string} alt={post?.authorName + "Avatar"} />
          <div>
            <Link
              href={
                post?.authorId
                  ? `/profile/${nip19.nprofileEncode({
                    pubkey: post?.authorId,
                  } as nip19.ProfilePointer)}`
                  : "#"
              }
              className="text-slate-200 font-semibold"
            >
              {post?.authorName}
            </Link>
            <br />
            <RelativeDate timestamp={post?.createdAt} />
          </div>
        </div>
        <div className="text-gray-500 cursor-pointer">
          <button className="hover:bg-slate-700 rounded-full p-1">
            <ThreeDots/>
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
      <div className="flex items-center justify-between">
        <div
          className={`group relative inline-block duration-300 ${reactions?.filter((r) => r.userId === GetCurrentAccount()?.pubkey)
            ?.length
            ? "text-slate-300"
            : "text-slate-500"
            }`}
        >
          <div className="flex items-center space-x-2 ">
            <button
              className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1"
              onClick={async () =>
                await LeaveLike(
                  "❤️",
                  post?.id as string,
                  post?.authorId as string,
                  "1"
                )
              }
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
        <button
          className={`flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1 ${replyFormActive ? "text-slate-400" : "text-slate-600"
            }`}
          onClick={() => setReplyFormActive(!replyFormActive)}
        >
          <Chat/>
          <span>{comments ? comments.length : 0}</span>
        </button>
      </div>
      <hr className="mt-2 mb-2" />
      <p className="text-slate-300 font-semibold mb-2">Comments</p>
      {replyFormActive ? (
        <PostForm
          type="Comment"
          updatePosts={async () => {
            updatePost();
            setReplyFormActive(false);
          }}
          commentAttributes={{
            root: post?.id as string,
            reply: "",
            replyTo: post?.authorId as string,
          }}
        />
      ) : null}
      <hr className="mb-2" />
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
