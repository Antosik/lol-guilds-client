import { writable } from "svelte/store";

import { randomId } from "@guilds-shared/helpers/functions";

export interface IAppStore {
  notifications: Array<{ id: string, text: string }>;
}

function createAppStore() {
  const getInitialStore = (): IAppStore => ({ notifications: [] });
  const { subscribe, update } = writable<IAppStore>(getInitialStore());


  const removeNotification = (id: string) => {
    update(state => ({ ...state, notifications: state.notifications.filter(notification => notification.id !== id) }));
  };

  const addNotification = (text: string) => {
    update(state => {
      const notification = {
        id: randomId(),
        text
      };
      setTimeout(() => removeNotification(notification.id), 4000);
      return ({ ...state, notifications: [...state.notifications, notification] });
    });
  };

  return {
    subscribe,
    addNotification,
    removeNotification
  };
}

export const appStore = createAppStore();