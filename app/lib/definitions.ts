export type Profile = {//kind 0
  id?: string;
  npub?: string;
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

export type Tag = {
  type: string;
  value: string;
};

export type Post = {//kind 1
  id?: string;
  authorId?: string; //pubkey
  authorName?:string;
  authorAvatar?:string;
  createdAt?: number;
  content?: string;
  tags?: Tag[];
};
