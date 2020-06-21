import { writable } from "svelte/store";

import { randomId } from "@guilds-shared/helpers/functions";

export interface IAppStore {
  notifications: Array<{ id: string, text: string }>;
  invitations: Array<{ id: string, text: string }>;
  currentPage: string;
}

function createAppStore() {
  const getInitialStore = (): IAppStore => ({ notifications: [], invitations: [], currentPage: "/client/" });
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

  const addInvitation = (invitationId: string, text: string) => {
    update(state => {
      const invitation = {
        id: invitationId,
        text
      };
      return { ...state, invitations: [...state.invitations, invitation] };
    });
  };

  const removeInvitation = (invitationId: string) => {
    update(state =>
      ({ ...state, invitations: state.invitations.filter(invitation => invitation.id !== invitationId) })
    );
  };

  const clearInvitations = () => {
    update(state => ({ ...state, invitations: [] }));
  };

  const setCurrentPage = (url: string) => {
    window.localStorage.setItem("currentPage", url);
    update(state => ({ ...state, currentPage: url }));
  };
  const setCurrentPageLoaded = ({ detail: { location } }: { detail: { location: string } }) => {
    window.localStorage.setItem("currentPage", location);
    update(state => ({ ...state, currentPage: location }));
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

    addInvitation,
    removeInvitation,
    clearInvitations,

    setCurrentPage,
    setCurrentPageLoaded,
    cleanCurrentPage
  };
}

export const appStore = createAppStore();