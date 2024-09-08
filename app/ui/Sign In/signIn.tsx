"use client";
import { useState } from "react";
import { nip19 } from "nostr-tools";
import { bytesToHex } from "@noble/hashes/utils";

import PrimaryButton from "@/app/ui/Components/PrimaryButton";
import Input from "@/app/ui/Components/Input";

import { SignIn_Nos2x, SignIn_nSec } from "@/app/lib/nostr";
import Redirect from "@/app/lib/redirect";

export default function SignIn() {
  const [isSec, setIsSec] = useState<boolean>(false);
  const [nSec, setNSec] = useState<string>("");

  //const [npub, setNpub] = useState("");

  return (
    <div className="flex flex-1 h-full text-slate-200 antialiased flex-col overflow-hidden bg-slate-950 py-6 sm:py-12">
      <div className="py-3 sm:w-96 mx-auto text-center">
        <span className="text-2xl font-light ">Login to your account</span>
        <div className="mt-4 bg-slate-900 shadow-md rounded-lg text-left">
          <div className="h-2 bg-purple-400 rounded-t-md"></div>
          <div className="px-8 py-6 ">
            <PrimaryButton caption="Sign In via nos2x" full click={async () => {
              await SignIn_Nos2x();
              Redirect("/profile");
            }} />
            <PrimaryButton caption="Sign In via nSec" full click={() => setIsSec(!isSec)} />
            {isSec ? (
              <div>
                <label className="block font-semibold"> NSec </label>
                <Input value={nSec} setValue={setNSec} placeholder="nSec" password />
                {/* <label className="block mt-3 font-semibold">NPub</label>
                <Input value={npub} placeholder="nPub"/> */}
                <div className="flex justify-between items-baseline">
                  <PrimaryButton caption="Login" click={async () => {
                    await SignIn_nSec(
                      bytesToHex(
                        nip19.decode<"nsec">(nSec as `nsec1${string}`)
                          .data as Uint8Array
                      )
                    );
                    Redirect("/profile");
                  }} />
                  <PrimaryButton caption="Generate new" click={() => Redirect("/signup")} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
