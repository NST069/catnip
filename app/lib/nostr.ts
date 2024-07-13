import { SimplePool } from "nostr-tools/pool";
import * as nip19 from "nostr-tools/nip19";
import type { WindowNostr } from "nostr-tools/nip07";
import { Dispatch, SetStateAction } from "react";
import { Event, getPublicKey, finalizeEvent, EventTemplate } from "nostr-tools";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

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
export const relays = [
  "wss://nostr.mom",
  "wss://nos.lol",
  "wss://relay.nostrcheck.me",
  "wss://purplepag.es",
];

const pool = new SimplePool();

let CurrentAccount: ExtensionAccount | LocalAccount | undefined;

export function GetCurrentAccount():
  | ExtensionAccount
  | LocalAccount
  | undefined {
  return CurrentAccount;
  //window.localStorage.getItem("currentAccount");
}

export async function AddAccount(account: ExtensionAccount | LocalAccount) {
  CurrentAccount = account;
  //window.localStorage.setItem("currentAccount", account.pubkey);
}

export async function SignIn_Nos2x() {
  if (window.nostr) {
    try {

      const pubkey = await window.nostr.getPublicKey();

      let userRelays: string[] = ((await GetRelays(pubkey)) as Relay[]).map(
        (r) => r.address
      );

      if (userRelays.length === 0) {
        userRelays = relays;
      }
      console.log("adding" + pubkey);
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
  const pubkey = getPublicKey(hexToBytes(nSec));

  let userRelays: string[] = [];
  try {
    userRelays = ((await GetRelays(pubkey)) as Relay[]).map((r) => r.address);
  } catch (e) {
    console.log("Failed to get relays", e);
    if (userRelays.length === 0) {
      userRelays = relays;
    }
  }
  AddAccount({
    pubkey,
    relays: userRelays,
    type: "local",
    readonly: false,
    nSec,
  });
}

export function LogOut() {
  CurrentAccount = undefined;
  window.localStorage.removeItem("currentAccount");
}

export async function GetProfile(
  pubkey: string,
  setProfile?: React.Dispatch<React.SetStateAction<Profile | undefined>>
): Promise<Profile | undefined> {
  if (pubkey == "") return;
  console.log("getting " + pubkey);
  let foundProfile = false;
  let h = pool.subscribeMany(
    CurrentAccount ? (CurrentAccount.relays as string[]) : relays,
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

export async function GetPosts(
  pubkey: string,
  setPosts: Dispatch<SetStateAction<string[] | undefined>>
) {
  if (pubkey == "") return;
  let events = await pool.querySync(relays, { authors: [pubkey], kinds: [1] });
  let posts = events
    .sort((a, b) => b.created_at - a.created_at)
    .map(
      /*async */ (e) =>
        /*{
      let p: Post = {};
      let authorEvt = await pool.querySync(relays, { authors: [e.pubkey], kinds: [0] });
      let author = JSON.parse(authorEvt[0].content);
      //let author = await GetProfile(e.pubkey);
      p.id = e.id;
      p.authorId = e.pubkey;
      p.authorName = author?.name;
      p.authorAvatar = author?.picture;
      p.content = e.content;
      p.createdAt = e.created_at;
      p.tags = e.tags
        .filter((t) => (t[0] = "r"))
        .map((t) => {
          return { type: t[0], value: t[1] } as Tag;
        })
        .filter((t, i, self) => self.map((x) => x.value).indexOf(t.value) == i);
        console.log(p);
      return p;
    }*/ e.id
    ); /* as Post[]*/
  setPosts ? setPosts(posts) : null;
}

export async function GetPostById(id: string): Promise<Post | undefined> {
  if (!id) return;
  let events = await pool.querySync(relays, { ids: [id] });
  let e = events[0];
  let p: Post = {};
  let authorEvt = await pool.querySync(relays, {
    authors: [e.pubkey],
    kinds: [0],
  });

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
  posts: Post[] | undefined,
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

  let h = pool.subscribeMany(relays, [filter], {
    async onevent(e) {
      let profile = await GetProfile(e.pubkey);
      let p: Post = {};
      p.id = e.id;
      p.authorId = e.pubkey;
      p.authorName = profile ? profile.name : "Anonymous";
      p.authorAvatar = profile ? profile.picture : "";
      p.content = e.content;
      p.createdAt = e.created_at;
      p.tags = e.tags
        .filter((t) => t[0] == "r")
        .map((t) => {
          return { type: t[0], value: t[1] } as Tag;
        })
        .filter((t, i, self) => self.map((x) => x.value).indexOf(t.value) == i);
      pp.push(p);
      setPosts(
        pp.sort((a, b) => (b.createdAt as number) - (a.createdAt as number))
      );
    },
    oneose() {
      setPosts(pp);
      h.close();
    },
  });
}

export async function GetFollows(
  pubkey: string
): Promise<string[] | undefined> {
  if (pubkey == "") return;
  let follows: string[] = [];
  let h = pool.subscribeMany(
    relays,
    [
      {
        authors: [pubkey],
        kinds: [3],
      },
    ],
    {
      onevent(event) {
        follows.push(...event.tags.filter((t) => t[0] == "p").map((t) => t[1]));
      },
      oneose() {
        h.close();
      },
    }
  );
  return follows;
}

export async function GetRelays(pubkey: string): Promise<Relay[] | undefined> {
  if (pubkey == "") return;
  let events = await pool.querySync(relays, {
    authors: [pubkey],
    kinds: [10002],
  });
  let userRelays = events[0]?.tags
    .filter((t) => t[0] == "r")
    .map((t) => {
      return {
        address: t[1],
        read: t[2] == "write" ? false : true,
        write: t[2] == "read" ? false : true,
      };
    });
  return userRelays;
}

export async function GetReactions(
  event: string
): Promise<Reaction[] | undefined> {
  if (event == "") return;
  let events = await pool.querySync(relays, {
    "#e": [event],
    kinds: [7],
  });
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
  let events = await pool.querySync(relays, {
    "#e": [event],
    kinds: [1],
  });
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

async function SignAndPublishEvent(evt: EventTemplate) {
  let signedEvent: Event | undefined;
  switch (CurrentAccount?.type) {
    case "local":
      signedEvent = finalizeEvent(
        evt,
        hexToBytes(CurrentAccount.nSec)
      ) as Event;
      break;
    case "extension":
      signedEvent = await window.nostr?.signEvent(evt);
      break;
    default:
      console.log("Cannot find proper signer");
      return;
  }
  await Promise.any(pool.publish(relays, signedEvent as Event));
  console.log("published to at least one relay!", signedEvent);
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
