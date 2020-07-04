declare module "svelte-spa-router";
declare module "svelte-spa-router/active";
declare module "markdown-it-for-inline";

declare interface INotification { id: string, text: string }

declare interface IAppStore {
  notifications: INotification[];
  invitations: INotification[];
  currentPage: string;
}

declare interface IGuildStore {
  guild?: IGuildAPIClubResponse | null;
  members: IInternalGuildMember[];
  role: number;
}

declare interface ISummonerStore {
  auth: boolean;
  summoner?:ILCUAPISummonerResponse | null;
  status?: string;
}