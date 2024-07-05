import { notFound } from "next/navigation";
import Profile from "@/app/ui/profile";

export default function Page({ params }: { params: { id: string } }) {
  // if (!false) {
  //     notFound();
  // }

  return (
    <div>
      <Profile id={params.id} />
    </div>
  );
}
