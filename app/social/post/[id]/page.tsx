"use client";

import { notFound } from "next/navigation";
import PostPage from "@/app/ui/postPage";
import Breadcrumbs from "@/app/ui/Breadcrumbs";

export default function Post({ params }: { params: { id: string, pid:string } }) {
  // if (!false) {
  //     notFound();
  // }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Social', href: '/social' },
          {
            label: 'Profile',
            href: `/social/profile/${params.pid}`,
            active: true,
          },
          {
            label: 'Post',
            href: `/social/post/${params.id}`,
            active: true,
          },
        ]}
      />
      <PostPage id={params.id} />
    </div>
  );
}