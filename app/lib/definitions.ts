export type Profile = {
  //kind 0
  id: string;
  npub: string;
  banner?: string;
  displayName?: string;
  picture?: string;
  lud06?: string;
  lud16?: string;
  name?: string;
  nip05?: string;
  website?: string;
  about?: string;
  //mastodon?: string; //tag: mostr
};

type CommonAccount = {
  pubkey: string;
  relays?: string[];
  //localSettings?: AppSettings; //profile configuration
};
  export type LocalAccount = CommonAccount & {
    type: "local";
    readonly: false;
    iv?: Uint8Array;
    nSec:string;
  };
//   export type PubkeyAccount = CommonAccount & {
//     type: "pubkey";
//     readonly: true;
//   };
export type ExtensionAccount = CommonAccount & {
  type: "extension";
  readonly: false;
};
//   export type SerialAccount = CommonAccount & {
//     type: "serial";
//     readonly: false;
//   };
//   export type AmberAccount = CommonAccount & {
//     type: "amber";
//     readonly: false;
//   };
//   export type NostrConnectAccount = CommonAccount & {
//     type: "nostr-connect";
//     clientSecretKey: string;
//     signerRelays: string[];
//     readonly: false;
//   };

export type Tag = {
  type: string;
  value: string;
};

export type Post = {
  //kind 1
  id?: string;
  authorId?: string; //pubkey
  authorName?: string;
  authorAvatar?: string;
  createdAt?: number;
  content?: string;
  tags?: Tag[];
};

export type Relay = {
  address: string;
  read: boolean;
  write: boolean;
};

export type Reaction = {
  content: string;
  createdAt: number;
  userId: string;
  reactionKind: string;//"+" | "-";
  emoji?:string;
};

export type Comment = {
    postId:string;
    createdAt:number;
    root:string;
    reply:string;
}