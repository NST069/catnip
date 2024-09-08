"use client";
import { useState, useEffect } from "react";

import Avatar from "@/app/ui/Components/Avatar";
import Input from "@/app/ui/Components/Input";
import PrimaryButton from "@/app/ui/Components/PrimaryButton";

import { Profile } from "@/app/lib/definitions";
import {
  GetProfile,
  GetCurrentAccount,
  UpdateProfile,
  GetNSec,
} from "@/app/lib/nostr";

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
        <Input value={name} setValue={setName} placeholder="Name" />
        <label className="block font-semibold">nSec</label>
        <div className="flex flex-row">
          <Input value={nSec} placeholder="nSec" disabled />
          <button className="mx-2" onClick={() => setNSec(GetNSec())}>Show</button>
        </div>
        <label className="block font-semibold">NIP-05</label>
        <Input value={nip05} setValue={setNip05} placeholder="NIP-05" />
        <label className="block font-semibold">Picture</label>
        <Avatar id={profile?.id} size={64} rounded src={picture as string} alt={"Profile Pic"} />
        <Input value={picture} setValue={setPicture} placeholder="Picture" />
        <label className="block font-semibold">Banner</label>
        <img
          className="object-cover object-center h-64"
          src={banner}
          alt="Banner Pic"
        />
        <Input value={banner} setValue={setBanner} placeholder="Banner" />
        <label className="block font-semibold">About</label>
        <Input value={about} setValue={setAbout} placeholder="About" />
        <label className="block font-semibold">Website</label>
        <Input value={website} setValue={setWebsite} placeholder="Website" />
      </div>
      <PrimaryButton caption="Submit" click={() =>
        UpdateProfile(profile?.id as string, {
          name: name,
          nip05: nip05,
          banner: banner,
          picture: picture,
          website: website,
          about: about,
        })
      } full />
    </div>
  );
}
