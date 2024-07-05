import { SimplePool } from "nostr-tools/pool";
import * as nip19 from "nostr-tools/nip19";
import type { WindowNostr } from "nostr-tools/nip07";
import { Dispatch, SetStateAction } from "react";

import { Profile, Post, Tag } from "@/app/lib/definitions";

declare global {
  interface Window {
    nostr?: WindowNostr;
  }
}
const relays = [
  "wss://nostr.mom",
  "wss://nos.lol",
  "wss://relay.nostrcheck.me",
  "wss://purplepag.es",
];

export async function GetProfile(pubkey: string): Promise<Profile | undefined> {
  const pool = new SimplePool();
  let events = await pool.querySync(relays, { authors: [pubkey], kinds: [0] });
  //console.log(pubkey, events, events[0]);
  if (events[0]) {
    console.log(JSON.parse(events[0].content) as Profile);
    let profile = JSON.parse(events[0].content) as Profile;
    profile.npub = nip19.npubEncode(events[0].pubkey);
    profile.id = events[0].pubkey;
    return profile;
  } else {
    console.log("I don\'t know who "+pubkey+" is:c", events);
    return;}
}

export async function GetPosts(pubkey: string): Promise<Post[]> {
  const pool = new SimplePool();
  /*
  let h = pool.subscribeMany(
    relays,
    [
      {
        authors: [pubkey],
        kinds: [1]
      },
    ],
    {
      onevent(event) {
        console.log(event);
      },
      oneose() {
        h.close();
      },
    }
  );
*/
  //await Promise.any(pool.publish(relays, newEvent));
  //console.log("published to at least one relay!");
  let events = await pool.querySync(relays, { authors: [pubkey], kinds: [1] });
  //console.log(events);
  let posts = events
    .sort((a, b) => b.created_at - a.created_at)
    .map((e) => {
      let p: Post = {};
      p.id = e.id;
      p.authorId = e.pubkey;
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
  //console.log(posts);
  return posts;
}

export async function GetFeed(
  posts: Post[] | undefined,
  setPosts: Dispatch<SetStateAction<Post[] | undefined>>,
  follows?: string[] | undefined
) /*: Promise<Post[]>*/ {
  const pool = new SimplePool();

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
  //console.log(filter);
  let pp: Post[] = [];

  let h = pool.subscribeMany(relays, [filter], {
    async onevent(e) {
      let profile = await GetProfile(e.pubkey);
      //console.log(e);
      let p: Post = {};
      p.id = e.id;
      p.authorId = e.pubkey;
      p.authorName=(profile?profile.name:"Anonymous");
      p.authorAvatar=(profile?profile.picture:"");
      p.content = e.content;
      p.createdAt = e.created_at;
      p.tags = e.tags
        .filter((t) => (t[0] = "r"))
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
      console.log("eose");
      setPosts(pp);
      //console.log(posts);
      h.close();
    },
  });
  //console.log(posts);
  //return posts;
}

export async function GetFollows(pubkey: string): Promise<string[]> {
  const pool = new SimplePool();
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
        follows.push(
          ...event.tags.filter((t) => (t[0] = "p")).map((t) => t[1])
        );
      },
      oneose() {
        h.close();
      },
    }
  );
  return follows;
}
