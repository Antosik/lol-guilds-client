import Store from "electron-store";

interface ISettingsStorePrototype {
  language: "ru" | "en";
}

const createSettingsStore = () => new Store<ISettingsStorePrototype>({
  name: "settings",
  defaults: {
    language: "ru"
  }
});

export const settingsStore = createSettingsStore();