import { SimplePool } from "nostr-tools/pool";
import * as nip19 from "nostr-tools/nip19";
import type { WindowNostr } from "nostr-tools/nip07";
import { Dispatch, SetStateAction } from "react";
import { Event, getPublicKey, finalizeEvent, EventTemplate } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

import SimpleCrypto from "simple-crypto-js";

import {
  Profile,
  Post,
  Tag,
  ExtensionAccount,
  LocalAccount,
  Relay,
  Reaction,
  Comment,
} from "@/app/lib/definitions";

declare global {
  interface Window {
    nostr?: WindowNostr;
  }
}
export const defaultRelays = [
  "wss://nostr.mom",
  "wss://nos.lol",
  "wss://relay.nostrcheck.me",
  "wss://purplepag.es",
];

const pool = new SimplePool();

let CurrentAccount: ExtensionAccount | LocalAccount | undefined;

let cachedKeys: { npub: string; nsec: string };
let cipherAlgorithm = "aes-192-cbc";

export function GetCurrentAccount():
  | ExtensionAccount
  | LocalAccount
  | undefined {
  return CurrentAccount;
  //window.localStorage.getItem("currentAccount");
}

function loadCurrentAccount() {
  if (typeof window !== "undefined") {
    let accstr = window.localStorage.getItem("currentAccount");
    if (accstr) {
      CurrentAccount = JSON.parse(accstr);
    }
  }
}
loadCurrentAccount();

export async function AddAccount(account: ExtensionAccount | LocalAccount) {
  CurrentAccount = account;
  window.localStorage.setItem("currentAccount", JSON.stringify(account));
}

export async function SignIn_Nos2x() {
  if (window.nostr) {
    try {
      const pubkey = await window.nostr.getPublicKey();

      let userRelays: string[] = ((await GetRelays(pubkey)) as Relay[]).map(
        (r) => r.address
      );

      if (userRelays.length === 0) {
        userRelays = defaultRelays;
      }

      AddAccount({
        pubkey,
        relays: userRelays,
        type: "extension",
        readonly: false,
      });
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  } else {
    console.log("Cant find exxtension");
  }
}

export async function SignIn_nSec(nSec: string) {
  let password = window.prompt("Enter passphrase");
  if (password) {
    const pubkey = getPublicKey(hexToBytes(nSec));
    let userRelays: string[] = [];
    try {
      userRelays = ((await GetRelays(pubkey)) as Relay[]).map((r) => r.address);
    } catch (e) {
      console.log("Failed to get relays", e);
      if (userRelays.length === 0) {
        userRelays = defaultRelays;
      }
    }
    const simpleCrypto = new SimpleCrypto(password);
    const encrypted = simpleCrypto.encrypt(nSec);

    cachedKeys = { npub: getPublicKey(hexToBytes(nSec)), nsec: nSec };

    AddAccount({
      pubkey,
      relays: userRelays,
      type: "local",
      readonly: false,
      nSec: encrypted,
    });
  } else window.alert("Passphrase must be set");
}

export function LogOut() {
  CurrentAccount = undefined;
  window.localStorage.removeItem("currentAccount");
}

export async function GetProfile(
  pubkey: string,
  setProfile?: React.Dispatch<React.SetStateAction<Profile | undefined>>
): Promise<Profile | undefined> {
  if (pubkey == "" || pubkey == undefined) {
    setProfile ? setProfile(undefined) : null;
    return;
  }

  let foundProfile = false;
  let h = pool.subscribeMany(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    [
      {
        authors: [pubkey],
        kinds: [0],
      },
    ],
    {
      onevent(event) {
        let profile = JSON.parse(event.content) as Profile;
        profile.npub = nip19.npubEncode(event.pubkey);
        profile.id = event.pubkey;
        h.close();
        setProfile ? setProfile(profile) : null;
        foundProfile = true;
        return profile;
      },
      oneose() {
        if (!foundProfile) console.log("I don't know who " + pubkey + " is:c");
        h.close();
      },
    }
  );
  return;
}

export async function GetPostCount(
  pubkey: string,
  setPostCount: Dispatch<SetStateAction<number>>
) {
  if (pubkey == "") {
    setPostCount(0);
    return;
  }
  let events = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    { authors: [pubkey], kinds: [1] }
  );
  let evCount = events.filter(
    (e) => e.tags?.filter((t) => t[3] === "root").length === 0
  ).length;
  setPostCount(evCount);
}

export async function GetPosts(
  pubkey: string,
  setPosts?: Dispatch<SetStateAction<Post[] | undefined>>
) {
  if (pubkey == "") return;
  let events = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    { authors: [pubkey], kinds: [1] }
  );
  let posts = events
    .filter((e) => e.tags?.filter((t) => t[3] === "root").length === 0)
    .sort((a, b) => b.created_at - a.created_at)
    .map((e) => {
      let p: Post = {};
      p.id = e.id;
      p.authorId = e.pubkey;
      p.authorName = "";
      p.authorAvatar = "";
      p.content = e.content;
      p.createdAt = e.created_at;
      p.tags = e.tags
        .filter((t) => (t[0] = "r"))
        .map((t) => {
          return { type: t[0], value: t[1] } as Tag;
        })
        .filter((t, i, self) => self.map((x) => x.value).indexOf(t.value) == i);
      return p;
    }) as Post[];
  setPosts && posts.length > 0 ? setPosts(posts) : null;
}

export async function GetPostById(id: string): Promise<Post | undefined> {
  if (!id) return;
  let events = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    { ids: [id] }
  );
  if(events.length===0) return;
  let e = events[0];
  let p: Post = {};
  let authorEvt = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    {
      authors: [e.pubkey],
      kinds: [0],
    }
  );

  let author = authorEvt[0] ? JSON.parse(authorEvt[0].content) : null;
  p.id = e.id;
  p.authorId = e.pubkey;
  p.authorName = author?.name;
  p.authorAvatar = author?.picture;
  p.content = e.content;
  p.createdAt = e.created_at;
  p.tags = e.tags
    .filter((t) => t[0] == "r")
    .map((t) => {
      return { type: t[0], value: t[1] } as Tag;
    })
    .filter((t, i, self) => self.map((x) => x.value).indexOf(t.value) == i);
  return p;
}

export async function GetFeed(
  setPosts: Dispatch<SetStateAction<Post[] | undefined>>,
  follows?: string[] | undefined
) {
  let filter = follows
    ? {
        authors: follows,
        kinds: [1],
        limit: 50,
      }
    : {
        kinds: [1],
        limit: 50,
      };

  let pp: Post[] = [];

  let h = pool.subscribeMany(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    [filter],
    {
      async onevent(e) {
        let p: Post = {};
        p.id = e.id;
        p.authorId = e.pubkey;
        p.authorName = "";
        p.authorAvatar = "";
        p.content = e.content;
        p.createdAt = e.created_at;
        p.tags = e.tags
          .filter((t) => t[0] == "r")
          .map((t) => {
            return { type: t[0], value: t[1] } as Tag;
          })
          .filter(
            (t, i, self) => self.map((x) => x.value).indexOf(t.value) == i
          );
        pp.push(p);
        setPosts(
          pp.sort((a, b) => (b.createdAt as number) - (a.createdAt as number))
        );
      },
      oneose() {
        setPosts(pp);
        h.close();
      },
    }
  );
}

export async function GetFollows(
  pubkey: string,
  setFollows?: Dispatch<SetStateAction<string[] | undefined>>
) {
  if (pubkey == "") return;
  let follows: string[] = [];
  let h = pool.subscribeMany(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    [
      {
        authors: [pubkey],
        kinds: [3],
      },
    ],
    {
      onevent(event) {
        event.tags
          .filter((t) => t[0] == "p")
          .map((t) => t[1])
          .forEach((t) => {
            if (follows.indexOf(t) < 0) follows.push(t);
          });
      },
      oneose() {
        h.close();
        setFollows ? setFollows(follows) : null;
      },
    }
  );
  return follows;
}

export async function GetRelays(
  pubkey: string,
  setRelays?: Dispatch<SetStateAction<Relay[] | undefined>>
): Promise<Relay[] | undefined> {
  if (pubkey == "") return;
  let events = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    {
      authors: [pubkey],
      kinds: [10002],
    }
  );
  let userRelays = events[0]?.tags
    .filter((t) => t[0] == "r")
    .map((t) => {
      return {
        address: t[1],
        read: t[2] == "write" ? false : true,
        write: t[2] == "read" ? false : true,
      };
    });
  setRelays ? setRelays(userRelays) : null;
  return userRelays;
}

export async function GetReactions(
  event: string
): Promise<Reaction[] | undefined> {
  if (event == "") return;
  let events = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    {
      "#e": [event],
      kinds: [7],
    }
  );
  let reactions = events.map((e) => {
    return {
      content: e.content,
      createdAt: e.created_at,
      userId: e.pubkey,
      reactionKind: "+",
      emoji: e.tags.filter((t) => t[0] === "emoji").map((t) => t[2])[0],
    };
  });
  return reactions;
}

export async function GetComments(
  event: string
): Promise<Comment[] | undefined> {
  if (event == "") return;
  let events = await pool.querySync(
    CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
    {
      "#e": [event],
      kinds: [1],
    }
  );
  if (events.length > 0) {
    let comments: Comment[] = events.map((e) => {
      let root = e.tags
        .filter((t) => t[0] == "e" && t[3] == "root")
        .map((t) => t[1])[0];
      let reply = e.tags
        .filter((t) => t[0] == "e" && t[3] == "reply")
        .map((t) => t[1])[0];
      return {
        postId: e.id,
        root: root,
        reply: reply,
        createdAt: e.created_at,
      } as Comment;
    });
    return comments.sort(
      (a, b) => (a.createdAt as number) - (b.createdAt as number)
    );
  }
  return undefined;
}

export function GetNSec(): string {
  if (CurrentAccount?.type === "local") {
    let password = window.prompt("Enter passphrase");
    let secKey = "";
    const simpleCrypto = new SimpleCrypto(password);
    try {
      secKey = nip19.nsecEncode(
        hexToBytes(simpleCrypto.decrypt(CurrentAccount.nSec).toString())
      );
    } catch (e) {
      window.alert("Wrong passphrase");
      return "";
    }
    return secKey;
  } else return "Cannot show nSec";
}

async function SignAndPublishEvent(evt: EventTemplate) {
  let signedEvent: Event | undefined;

  switch (CurrentAccount?.type) {
    case "local":
      let secKey = "";
      if (cachedKeys) secKey = cachedKeys.nsec;
      else {
        let password = window.prompt("Enter passphrase");
        const simpleCrypto = new SimpleCrypto(password);
        try {
          secKey = simpleCrypto.decrypt(CurrentAccount.nSec).toString();
          cachedKeys = { npub: getPublicKey(hexToBytes(secKey)), nsec: secKey };
        } catch (e) {
          window.alert("Wrong passphrase");
          return;
        }
      }

      signedEvent = finalizeEvent(evt, hexToBytes(secKey)) as Event;
      break;
    case "extension":
      signedEvent = await window.nostr?.signEvent(evt);
      break;
    default:
      console.log("Cannot find proper signer");
      return;
  }

  await Promise.any(
    pool.publish(
      CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
      signedEvent as Event
    )
  );
  //console.log("published to at least one relay!", signedEvent);
}

export async function UpdateProfile(
  pubkey: string,
  {
    name,
    nip05,
    picture,
    banner,
    website,
    about,
  }: {
    name?: string;
    nip05?: string;
    picture?: string;
    banner?: string;
    website?: string;
    about?: string;
  }
) {
  let profile: Profile = (await GetProfile(pubkey, undefined)) as Profile;
  if (!profile)
    profile = {
      id: pubkey,
      npub: nip19.npubEncode(pubkey),
      banner: "",
      displayName: "",
      picture: "",
      lud06: "",
      lud16: "",
      name: "",
      nip05: "",
      website: "",
      about: "",
    } as Profile;
  profile.name = name ? name : profile.name;
  profile.nip05 = nip05 ? nip05 : profile.nip05;
  profile.picture = picture ? picture : profile.picture;
  profile.banner = banner ? banner : profile.banner;
  profile.website = website ? website : profile.website;
  profile.about = about ? about : profile.about;
  let evtProfile: EventTemplate = {
    kind: 0,
    tags: [],
    content: JSON.stringify(profile),
    created_at: Math.floor(Date.now() / 1000),
  };

  SignAndPublishEvent(evtProfile);
}

export async function UpdateRelays(pubkey: string, relays?: Relay[]) {
  let rel = relays
    ? relays
    : defaultRelays.map((r) => {
        return { address: r, read: true, write: true } as Relay;
      });
  let evtRelays: EventTemplate = {
    kind: 10002,
    tags: rel.map((r) => {
      let relay = ["r", r.address];
      if (r.read && !r.write) relay[2] = "read";
      else if (!r.read && r.write) relay[2] = "write";
      return relay;
    }),
    content: "",
    created_at: Math.floor(Date.now() / 1000),
  };
  SignAndPublishEvent(evtRelays);
}

export async function SubmitPost(content: string) {
  let evtPost: EventTemplate = {
    kind: 1,
    tags: [],
    content: content,
    created_at: Math.floor(Date.now() / 1000),
  };
  SignAndPublishEvent(evtPost);
}

export async function SubmitComment(
  content: string,
  root: string,
  reply: string,
  replyTo: string
) {
  const evtComment: EventTemplate = {
    kind: 1,
    tags: [
      ["e", root, "", "root"],
      ["p", replyTo],
    ],
    content: content,
    created_at: Math.floor(Date.now() / 1000),
  };
  if (reply) evtComment.tags.push(["e", reply, "", "reply"]);
  SignAndPublishEvent(evtComment);
}

export async function LeaveLike(
  content: string,
  eventId: string,
  authorId: string,
  eventKind: string,
  emoji?: { name: string; url: string }
) {
  GetReactions(eventId).then((reactions) => {
    if (
      reactions?.filter((r) => r.userId === CurrentAccount?.pubkey).length === 0
    ) {
      let fx = async () => {
        let evtLike: EventTemplate = {
          kind: 7,
          tags: [
            ["e", eventId],
            ["p", authorId],
            ["k", eventKind],
          ],
          content: emoji ? `:${emoji.name}:` : content,
          created_at: Math.floor(Date.now() / 1000),
        };
        if (emoji) evtLike.tags.push(["emoji", emoji.name, emoji.url]);
        SignAndPublishEvent(evtLike);
      };
      fx();
    } else {
      //remove like from event
      console.log("Post was already liked by you");
    }
  });
}

export async function CheckFollow(
  pubkey: string,
  setIsFollowed?: Dispatch<SetStateAction<boolean>>
) {
  if (!CurrentAccount || CurrentAccount.pubkey === pubkey) return;
  let event = (
    await pool.querySync(
      CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
      {
        authors: [CurrentAccount.pubkey],
        kinds: [3],
      }
    )
  )[0];
  let res = event.tags.filter((t) => t[0] == "p" && t[1] == pubkey).length > 0;
  setIsFollowed ? setIsFollowed(res) : null;
  return res;
}

export async function ToggleFollowing(pubkey: string, toggle?: () => void) {
  if (!CurrentAccount || CurrentAccount.pubkey === pubkey) return;
  let event = (
    await pool.querySync(
      CurrentAccount ? (CurrentAccount.relays as string[]) : defaultRelays,
      {
        authors: [CurrentAccount.pubkey],
        kinds: [3],
      }
    )
  )[0];
  let tags = event.tags;
  if (tags.filter((t) => t[0] == "p" && t[1] == pubkey).length > 0)
    tags = tags.filter((t) => t[1] !== pubkey);
  else tags.push(["p", pubkey]);
  let fx = async () => {
    let evtFollows: EventTemplate = {
      kind: 3,
      tags,
      content: event.content,
      created_at: Math.floor(Date.now() / 1000),
    };
    SignAndPublishEvent(evtFollows).then(() => (toggle ? toggle() : null));
  };
  fx();
}
