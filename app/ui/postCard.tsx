import moment from "moment";
import React, { useState, useEffect, useActionState } from "react";

import { Post, Tag, Profile } from "@/app/lib/definitions";
import { GetProfile } from "@/app/lib/nostr";

export default function PostCard({
  post,
  defaultUser,
}: {
  post: Post | undefined;
  defaultUser?: Profile | undefined;
}) {
//   const [user, setUser] = useState<Profile>();
//     useEffect(() => {
//       let fetch = async () => {
//   		console.log(defaultUser?.id, post?.authorId, defaultUser?.id !== post?.authorId)
//         if (!defaultUser && post)
//           setUser(await GetProfile(post.authorId as string));
//       };
//       fetch();
//     }, []);

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-md my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img
            //src={user ? user.picture : defaultUser?.picture}
            //alt={(user? user.name: defaultUser?.name) + " Avatar"}
			src={post?.authorAvatar}
			alt={post?.authorName + "Avatar"}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-slate-200 font-semibold">
              {/*(user ? user?.name : defaultUser?.name) + " - "+post?.authorId*/ post?.authorName}
            </p>
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
      <div className="flex items-center justify-between text-slate-500">
        <div className="flex items-center space-x-2">
          <button className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1">
            <svg
              className="w-5 h-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>42 Likes</span>
          </button>
        </div>
        {/*<button className="flex justify-center items-center gap-2 px-2 hover:bg-slate-700 rounded-full p-1">
				<svg width="22px" height="22px" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
					<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
					<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
					<g id="SVGRepo_iconCarrier">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"></path>
					</g>
				</svg>
				<span>3 Comment</span>
			</button>*/}
      </div>
      {/*<hr className="mt-2 mb-2"/>
		<p className="text-slate-200 font-semibold">Comment</p>
		<hr className="mt-2 mb-2"/>
		<div className="mt-4">
			<div className="flex items-center space-x-2">
				<img src="https://placekitten.com/32/32" alt="User Avatar" className="w-6 h-6 rounded-full"/>
				<div>
					<p className="text-slate-200 font-semibold">Jane Smith</p>
					<p className="text-slate-400 text-sm">Lovely shot! 📸</p>
				</div>
			</div>
			<div className="flex items-center space-x-2 mt-2">
				<img src="https://placekitten.com/32/32" alt="User Avatar" className="w-6 h-6 rounded-full"/>
				<div>
					<p className="text-slate-200 font-semibold">Bob Johnson</p>
					<p className="text-slate-400 text-sm">I can't handle the cuteness! Where can I get one?</p>
				</div>
			</div>
			<div className="flex items-center space-x-2 mt-2 ml-6">
				<img src="https://placekitten.com/40/40" alt="User Avatar" className="w-6 h-6 rounded-full"/>
				<div>
					<p className="text-slate-200 font-semibold">John Doe</p>
					<p className="text-slate-400 text-sm">That little furball is from a local shelter. You should check it out! 🏠😺</p>
				</div>
			</div>
		</div>*/}
    </div>
  );
}
