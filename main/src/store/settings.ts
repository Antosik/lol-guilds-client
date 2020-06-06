import Store from "electron-store";

interface ISettingsStorePrototype {
  language: "RU" | "EN";
}

const createSettingsStore = () => new Store<ISettingsStorePrototype>({
  name: "settings",
  defaults: {
    language: "RU"
  }
});

export const settingsStore = createSettingsStore();