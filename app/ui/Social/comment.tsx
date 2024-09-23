"use client";
import React, { useState, useEffect, useActionState } from "react";
import Link from "next/link";
import { nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";
import RelativeDate from "@/app/ui/Components/RelativeDate";
import Paragraph from "@/app/ui/Components/Paragraph";

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
import { Like, Reply } from "@/app/lib/iconset";

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
        <Avatar id={post?.authorId} size={12} rounded src={post?.authorAvatar as string} alt={post?.authorName + " Avatar"} />
        <div className="flex-col mt-1 px-4">
          <Link
            href={
              post?.authorId
                ? `/profile/${nip19.nprofileEncode({
                  pubkey: post?.authorId,
                } as nip19.ProfilePointer)}`
                : "#"
            }
            className="flex items-center flex-1 font-bold leading-tight"
          >
            {post?.authorName}
            <span className="ml-2">
              <RelativeDate timestamp={post?.createdAt} />
            </span>
          </Link>
          <Paragraph content={post?.content}/>
          <button
            className="inline-flex items-center px-1 pt-2 ml-1 flex-column text-slate-500"
            onClick={() => setReplyFormActive(!replyFormActive)}
          >
            <Reply replyFormActive={replyFormActive}/>
          </button>
          <button
            className={`inline-flex items-center px-1 -ml-1 flex-column ${reactions?.filter((r) => r.userId === GetCurrentAccount()?.pubkey)
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
            <Like/>
            <span>{reactions ? reactions.length : 0}</span>
          </button>
        </div>
      </div>
      {replyFormActive ? (
        <PostForm
          type="Comment"
          updatePosts={async () => {
            console.log("reloading")
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
