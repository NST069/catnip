"use client";
import { useState, useCallback, useEffect } from "react";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { generateSecretKey, getPublicKey, nip19 } from "nostr-tools";

import Avatar from "@/app/ui/Components/Avatar";
import PrimaryButton from "@/app/ui/Components/PrimaryButton";
import Input from "@/app/ui/Components/Input";

import {
  SignIn_nSec,
  defaultRelays,
  UpdateProfile,
  UpdateRelays,
} from "@/app/lib/nostr";
import Redirect from "@/app/lib/redirect";

export default function Register() {
  const [nSec, setNSec] = useState<string>("");
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
  }, [setHexKey, setNSec]);

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
                  <Input value={nSec} setValue={setNSec} password placeholder="nSec" />
                  <label className="block mt-3 font-semibold">NPub</label>
                  <Input value={npub} placeholder="nPub" />
                  <label className="block font-semibold">Name</label>
                  <Input value={name} setValue={setName} placeholder="Name" />
                </div>
                <div className="flex flex-col flex-1">
                  <label className="block font-semibold">Picture</label>
                  <div className="flex-shrink-0">
                    <Avatar id={pubKey} src={picture} alt={"Profile Pic"} />
                  </div>
                  <Input value={picture} setValue={setPicture} placeholder="Picture" />
                  {/* nsec1q5maes60aaw02rj9hwd54cwsj4qtyewt3a5039vymp3xs0guyzeqsknnqx */}
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <PrimaryButton caption="Back" click={() => Redirect("/signin")} />
                <PrimaryButton caption="Login" click={async () => {
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
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
