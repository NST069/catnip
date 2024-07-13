import { Relay } from "@/app/lib/definitions";

export default function Relays({ relays }: { relays: Relay[] | undefined }) {
  
  return (
    <div>
      {relays?.map((r) => (
        <div className="flex flex-row items-start text-slate-500 h-10">
          <div className="flex-1 h-full">{r.address}</div>
          {r.read ? (
            <div className="w-2 h-2 m-4 bg-green-500 rounded-full" />
          ) : null}
          {r.write ? (
            <div className="w-2 h-2 m-4 bg-blue-500 rounded-full" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
