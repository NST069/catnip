import ProfileCardSmall from "@/app/ui/profileCardSmall";

export default function Follows({
  follows,
}: {
  follows: string[] | undefined;
}) {
  return (
    <div>
      {follows?.map((p) => (
        <ProfileCardSmall id={p}/>
      ))}
    </div>
  );
}
