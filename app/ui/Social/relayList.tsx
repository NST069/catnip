import RelayItem from "@/app/ui/Components/Relay";

import { Relay } from "@/app/lib/definitions";

export default function Relays({ relays }: { relays: Relay[] | undefined }) {
  return (
    <div>
      {relays?.map((r, ind) =>
        <RelayItem r={r} ind={ind} />
      )}
    </div>
  );
}
