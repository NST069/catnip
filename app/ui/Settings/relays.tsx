"use client";
import { useState, useEffect } from "react";

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
          <div
            className="flex flex-row items-start text-slate-500 h-10 my-5"
            key={ind}
          >
            <span className="text-xl font-light w-full">{r.address}</span>
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
            <div
              className="w-2 h-2 m-4"
              onClick={(e) => {
                setRelays(relays.filter((rel) => rel !== r));
              }}
            >
              x
            </div>
          </div>
        ))}
        <div className="flex flex-row items-start text-slate-500 h-10 my-5">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="relay"
            className="border w-full h-full bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
          />
          <div
            className={`w-2 h-2 m-4 hover:cursor-pointer ${
              read ? "bg-green-500" : "bg-green-950"
            } rounded-full`}
            onClick={() => setRead(!read)}
          />
          <div
            className={`w-2 h-2 m-4 hover:cursor-pointer ${
              write ? "bg-blue-500" : "bg-blue-950"
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
      <div
        className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-slate-200 ml-2 bg-indigo-500"
        onClick={() =>
          UpdateRelays(GetCurrentAccount()?.pubkey as string, relays as Relay[])
        }
      >
        Submit
      </div>
    </div>
  );
}
