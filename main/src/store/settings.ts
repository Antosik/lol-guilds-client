import Store from "electron-store";

interface ISettingsStorePrototype {
  language: "ru" | "en";
  features: Record<string, boolean>;
}

const createSettingsStore = () => new Store<ISettingsStorePrototype>({
  name: "settings",
  defaults: {
    language: "ru",
    features: {
      discord: true
    }
  }
});

export const settingsStore = createSettingsStore();