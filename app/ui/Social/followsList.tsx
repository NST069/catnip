import ProfileCardSmall from "@/app/ui/Social/profileCardSmall";

export default function Follows({
  follows,
}: {
  follows: string[] | undefined;
}) {
  return (
    <div>
      {follows?.map((p, ind) => (
        <ProfileCardSmall id={p} key={ind}/>
      ))}
    </div>
  );
}
