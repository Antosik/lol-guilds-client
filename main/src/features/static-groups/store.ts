import Store from "electron-store";

// GroupName to SummonerNames map
interface IStaticGroupsStorePrototype {
  [id: string]: {
    name: string;
    members: string[];
  };
}

export class StaticGroupsStore extends Store<IStaticGroupsStorePrototype> {
  constructor() {
    super({
      name: "staticGroups",
      defaults: {}
    });
  }

  public getAll(): IStaticGroupsStorePrototype {
    return this.store;
  }
}
