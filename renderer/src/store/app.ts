import { writable } from "svelte/store";

import { randomId } from "@guilds-shared/helpers/functions";
import { isExists } from "@guilds-shared/helpers/typeguards";


function createAppStore() {
  const getInitialStore = (): IAppStore => ({ notifications: [], invitations: [], currentPage: "/client/" });

  // eslint-disable-next-line @typescript-eslint/unbound-method
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

  const setCurrentPageLoaded = (e: CustomEvent<{ location: string }>) => {
    const { detail: { location } } = e;
    window.localStorage.setItem("currentPage", location);
    update(state => ({ ...state, currentPage: location }));
  };

  const cleanCurrentPage = () => {
    window.localStorage.removeItem("currentPage");
    update(state => ({ ...state, currentPage: "" }));
  };

  const savedCurrentPage = window.localStorage.getItem("currentPage");
  if (isExists(savedCurrentPage)) {
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