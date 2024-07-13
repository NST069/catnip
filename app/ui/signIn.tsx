"use client";
import { useState, useCallback } from "react";

import { SignIn_Nos2x, SignIn_nSec, relays } from "@/app/lib/nostr";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import Redirect from "@/app/lib/redirect";

export default function SignIn() {
  const [isSec, setIsSec] = useState<boolean>(false);
  const [nSec, setNSec] = useState<string>();
  const [show, setShow] = useState(false);
  const [hexKey, setHexKey] = useState("");
  const [relayUrl, setRelayUrl] = useState<string[]>(relays);

  const [npub, setNpub] = useState("");

  const generateNewKey = useCallback(() => {
    const hex = generateSecretKey();
    const pubkey = getPublicKey(hex);
    setHexKey(bytesToHex(hex));
    setNSec(nip19.nsecEncode(hex));
    setNpub(nip19.npubEncode(pubkey));
    setShow(true);
  }, [setHexKey, setNSec, setShow, nSec]);

  return (
    <div className="flex flex-1 h-full text-slate-200 antialiased flex-col overflow-hidden bg-slate-950 py-6 sm:py-12">
      <div className="py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light ">Login to your account</span>
        <div className="mt-4 bg-slate-900 shadow-md rounded-lg text-left">
          <div className="h-2 bg-purple-400 rounded-t-md"></div>
          <div className="px-8 py-6 ">
            <button
              type="submit"
              className="mt-4 bg-purple-500 text-slate-200 py-2 px-6 rounded-md hover:bg-purple-600 w-full"
              onClick={async () => {
                await SignIn_Nos2x();
                Redirect("/social/profile");
              }}
            >
              Sign In via nos2x
            </button>
            <button
              className="mt-4 bg-purple-500 text-slate-200 py-2 px-6 rounded-md hover:bg-purple-600 w-full"
              onClick={() => setIsSec(!isSec)}
            >
              Sign In via nSec
            </button>
            {isSec ? (
              <div>
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
                <div className="flex justify-between items-baseline">
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
                      Redirect("/social/profile");
                    }}
                  >
                    Login
                  </button>

                  <button
                    className="mt-4 bg-purple-500 text-slate-200 py-2 px-6 rounded-md hover:bg-purple-600 "
                    onClick={() => generateNewKey()}
                  >
                    Generate new
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
