"use client";
import { useState, useEffect } from "react";

import { Profile } from "@/app/lib/definitions";
import {
  GetProfile,
  GetCurrentAccount,
  UpdateProfile,
  GetNSec,
} from "@/app/lib/nostr";
import Image from "next/image";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>();

  const [name, setName] = useState<string>("");
  const [nSec, setNSec] = useState<string>("");
  const [nip05, setNip05] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  // const [lud06, setLud06] = useState<string>("");
  // const [lud16, setLud16] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      await GetProfile(GetCurrentAccount()?.pubkey as string, setProfile);
    };
    fetch();
  }, []);
  useEffect(() => {
    setName(profile?.name as string);
    setNip05(profile?.nip05 as string);
    setAbout(profile?.about as string);
    setPicture(profile?.picture as string);
    setBanner(profile?.banner as string);
    setWebsite(profile?.website as string);
  }, [profile]);

  return (
    <div>
      <span className="text-2xl font-light ">Profile</span>
      <div>
        <label className="block font-semibold">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
        />
        <label className="block font-semibold">nSec</label>
        <div className="flex flex-row">
          <input
            type="text"
            disabled
            value={nSec}
            placeholder="nSec"
            className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
          />
          <button className="mx-2" onClick={() => setNSec(GetNSec())}>Show</button>
        </div>
        <label className="block font-semibold">NIP-05</label>
        <input
          type="text"
          value={nip05}
          onChange={(e) => setNip05(e.target.value)}
          placeholder="NIP-05"
          className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
        />
        <label className="block font-semibold">Picture</label>
        <img
          className="object-cover object-center h-64"
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
        <label className="block font-semibold">Banner</label>
        <img
          className="object-cover object-center h-64"
          src={banner}
          alt="Banner Pic"
        />
        <input
          type="text"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          placeholder="Banner"
          className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
        />
        <label className="block font-semibold">About</label>
        <input
          type="text"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="About"
          className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
        />
        <label className="block font-semibold">Website</label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Website"
          className="border w-full h-5 px-3 py-5 mt-2 bg-slate-800 hover:outline-none focus:outline-none focus:ring-indigo-500 focus:ring-1 rounded-md"
        />
      </div>
      <div
        className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-slate-200 ml-2 bg-indigo-500"
        onClick={() =>
          UpdateProfile(profile?.id as string, {
            name: name,
            nip05: nip05,
            banner: banner,
            picture: picture,
            website: website,
            about: about,
          })
        }
      >
        Submit
      </div>
    </div>
  );
}
