import { writable } from "svelte/store";

import { randomId } from "@guilds-shared/helpers/functions";

export interface IAppStore {
  notifications: Array<{ id: string, text: string }>;
  currentPage: string;
}

function createAppStore() {
  const getInitialStore = (): IAppStore => ({ notifications: [], currentPage: "" });
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
      setTimeout(() => removeNotification(notification.id), 5000);
      return ({ ...state, notifications: [...state.notifications, notification] });
    });
  };


  const setCurrentPage = (url: string) => {
    window.localStorage.setItem("currentPage", url);
    update(state => ({ ...state, currentPage: url }));
  };
  const cleanCurrentPage = () => {
    window.localStorage.removeItem("currentPage");
    update(state => ({ ...state, currentPage: "" }));
  };
  const savedCurrentPage = window.localStorage.getItem("currentPage");
  if (savedCurrentPage !== null) {
    setCurrentPage(savedCurrentPage);
  }

  return {
    subscribe,
    addNotification,
    removeNotification,
    setCurrentPage,
    cleanCurrentPage
  };
}

export const appStore = createAppStore();