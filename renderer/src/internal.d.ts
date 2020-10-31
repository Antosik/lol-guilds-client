declare module "svelte-spa-router/active";
declare module "markdown-it-for-inline";

declare interface INotification { id: string, text: string }

interface Window {
  LGC: {
    currentLocale: string | undefined;
    locales: Record<string, IKeyValue> | undefined;
  };
}

declare interface IDataStore<T> {
  isLoading: boolean;
  data: T;
}

declare type TGuildStore = IDataStore<IGuildAPIClubResponse | null>;
declare type TGuildMembersStore = IDataStore<IInternalGuildMember[]>;
declare type TGuildRoleStore = IDataStore<number>;
declare type TSummonerStore = IDataStore<IInternalCurrentSummoner | null>;