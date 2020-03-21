export const enum EFriendStatus {
  Away = "away",
  Online = "chat",
  InGame = "dnd",
  Mobile = "mobile",
  Offline = "offline"
}

export interface IFriendCore {
  id: string;
  name: string;
  summonerId: number;
  availability: EFriendStatus;
}

export interface IFriend extends IFriendCore {
  basic: string;
  displayGroupId: number;
  displayGroupName: string;
  gameName: string;
  gameTag: string;
  groupId: number;
  groupName: string;
  icon: number;
  isP2PConversationMuted: true;
  lastSeenOnlineTimestamp: string;
  lol: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  note: string;
  patchline: string;
  pid: string;
  platformId: string;
  product: string;
  productName: string;
  statusMessage: string;
  summary: string;
  time: number;
}

export interface IFriendRequest {
  direction: "in" | "out" | "both";
  gameName?: string;
  gameTag?: string;
  id?: string;
  name?: string;
  note?: string;
  pid?: string;
  summonerId: number;
}