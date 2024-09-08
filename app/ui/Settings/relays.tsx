"use client";
import { useState, useEffect } from "react";

import RelayItem from "@/app/ui/Components/Relay";
import PrimaryButton from "@/app/ui/Components/PrimaryButton";
import Input from "@/app/ui/Components/Input";

import { Relay } from "@/app/lib/definitions";
import { GetRelays, GetCurrentAccount, UpdateRelays } from "@/app/lib/nostr";

export default function Relays() {
  const [relays, setRelays] = useState<Relay[]>();
  //const [newRelay, setNewRelay] = useState<Relay>({} as Relay);
  const [address, setAddress] = useState<string>("");
  const [read, setRead] = useState<boolean>(true);
  const [write, setWrite] = useState<boolean>(false);

  useEffect(() => {
    let fetch = async () => {
      await GetRelays(GetCurrentAccount()?.pubkey as string, setRelays);
    };
    fetch();
  }, []);

  return (
    <div>
      <span className="text-2xl font-light ">Relays</span>
      <div>
        {relays?.map((r, ind) => (
          <RelayItem r={r} ind={ind} deleteFx={() => setRelays(relays.filter((rel) => rel !== r))} />
        ))}
        <div className="flex flex-row items-start text-slate-500 h-10 my-5">
          <Input value={address} setValue={setAddress} placeholder="relay" />
          <div
            className={`w-2 h-2 m-4 hover:cursor-pointer ${read ? "bg-green-500" : "bg-green-950"
              } rounded-full`}
            onClick={() => setRead(!read)}
          />
          <div
            className={`w-2 h-2 m-4 hover:cursor-pointer ${write ? "bg-blue-500" : "bg-blue-950"
              } rounded-full`}
            onClick={() => setWrite(!write)}
          />
          <div
            className="w-2 h-2 m-4 hover:cursor-pointer"
            onClick={(e) => {
              setRelays([
                ...(relays as Relay[]),
                { address, read, write } as Relay,
              ]);
            }}
          >
            +
          </div>
        </div>
      </div>
      <PrimaryButton caption="Submit" click={() =>
        UpdateRelays(GetCurrentAccount()?.pubkey as string, relays as Relay[])} full />
    </div>
  );
}
