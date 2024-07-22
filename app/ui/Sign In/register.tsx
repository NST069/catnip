"use client";
import { useState, useCallback, useEffect } from "react";

import { SignIn_nSec, defaultRelays, UpdateProfile, UpdateRelays } from "@/app/lib/nostr";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import Redirect from "@/app/lib/redirect";
import Image from "next/image";

export default function Register() {
  const [nSec, setNSec] = useState<string>("");
  const [show, setShow] = useState(false);
  const [hexKey, setHexKey] = useState("");
  //const [relayUrl, setRelayUrl] = useState<string[]>(defaultRelays);
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [pubKey, setPubKey] = useState<string>("");
  const [npub, setNpub] = useState("");

  const generateNewKey = useCallback(() => {
    const hex = generateSecretKey();
    const pubkey = getPublicKey(hex);
    setHexKey(bytesToHex(hex));
    setPubKey(pubkey);
    setNSec(nip19.nsecEncode(hex));
    setNpub(nip19.npubEncode(pubkey));
    setShow(true);
  }, [setHexKey, setNSec, setShow]);

  useEffect(() => {
    generateNewKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 h-full text-slate-200 antialiased flex-col overflow-hide bg-slate-950 py-6 sm:py-12">
      <div className="py-3 mx-auto text-center">
        <span className="text-2xl font-light ">Register new account</span>
        <div className="mt-4 bg-slate-900 shadow-md rounded-lg text-left">
          <div className="h-2 bg-purple-400 rounded-t-md"></div>
          <div className="px-8 py-6 ">
            <div className="flex flex-col">
              <div className="flex flex-row gap-2">
                <div className="flex flex-col flex-grow">
                  <label className="block font-semibold"> NSec </label>
                  <input
                    type={show ? "text" : "password"}
                    value={nSec}
                    onChange={(e) => setNSec(e.target.value)}
                    placeholder="nSec"
                    className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
                  />
                  <button onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </button>
                  <label className="block mt-3 font-semibold">NPub</label>
                  <input
                    type="text"
                    placeholder="nPub"
                    disabled
                    value={npub}
                    className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
                  />
                  <label className="block font-semibold">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="block font-semibold">Picture</label>
                  <img
                    className="aspect-square object-cover flex-shrink-0" //"object-cover object-center flex-1 w-auto"
                    src={picture}
                    alt="Profile Pic"
                  />
                  <input
                    type="text"
                    value={picture}
                    onChange={(e) => setPicture(e.target.value)}
                    placeholder="Picture"
                    className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <button
                  className="mt-4 bg-purple-500 text-slate-200 py-2 px-6 rounded-md hover:bg-purple-600 "
                  onClick={() => Redirect("/signin")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="mt-4 bg-purple-500 text-slate-200 py-2 px-6 rounded-md hover:bg-purple-600 "
                  onClick={async () => {
                    await SignIn_nSec(
                      bytesToHex(
                        nip19.decode<"nsec">(nSec as `nsec1${string}`)
                          .data as Uint8Array
                      )
                    );
                    UpdateProfile(pubKey as string, {
                      name: name,
                      picture: picture,
                    });
                    UpdateRelays(pubKey as string);
                    Redirect("profile");
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
