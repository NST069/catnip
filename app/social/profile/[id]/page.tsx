import { notFound } from "next/navigation";
import Profile from "@/app/ui/profile";
import Breadcrumbs from "@/app/ui/Breadcrumbs";

export default function Page({ params }: { params: { id: string } }) {
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
            href: `/social/profile/${params.id}`,
            active: true,
          },
        ]}
      />
      <Profile id={params.id} />
    </div>
  );
}
