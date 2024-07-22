import { Relay } from "@/app/lib/definitions";

export default function Relays({ relays }: { relays: Relay[] | undefined }) {
  return (
    <div>
      {relays?.map((r) => (
        <div className="flex flex-row items-start text-slate-500 h-10">
          <div className="flex-1 h-full">{r.address}</div>
          <div
            className={`w-2 h-2 m-4 ${
              r.read ? "bg-green-500" : "bg-green-950"
            } rounded-full`}
          />
          <div
            className={`w-2 h-2 m-4 ${
              r.write ? "bg-blue-500" : "bg-blue-950"
            } rounded-full`}
          />
        </div>
      ))}
    </div>
  );
}
