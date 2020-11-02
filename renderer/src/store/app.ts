import { writable } from "svelte/store";

import { randomId } from "@guilds-shared/helpers/functions";
import { isExists } from "@guilds-shared/helpers/typeguards";


// #region Invitations Store
function createInvitationsStore() {

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { subscribe, update } = writable<INotification[]>([]);

  const remove = (invitationId: string) => {
    update(state => state.filter(invitation => invitation.id !== invitationId));
  };

  const add = (invitationId: string, text: string) => {
    update(state => {
      const invitation = {
        id: invitationId,
        text
      };
      return [...state, invitation];
    });
  };

  const clear = () => {
    update(() => []);
  };

  return {
    subscribe,
    add,
    remove,
    clear
  };
}
export const invitations = createInvitationsStore();
// #endregion Invitations Store


// #region Notifications Store
function createNotificationsStore() {

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { subscribe, update } = writable<INotification[]>([]);
  const permanentStore = new Set();

  const remove = (notificationId: string) => {
    update(state => state.filter(notification => notification.id !== notificationId));
  };

  const add = (text: string) => {
    update(state => {
      const notification = {
        id: randomId(),
        text
      };
      setTimeout(() => remove(notification.id), 4000);
      return [...state, notification];
    });
  };

  const addPermanent = (text: string) => {

    if (permanentStore.has(text.toLowerCase())) return;
    permanentStore.add(text.toLowerCase());

    update(state => {
      const notification = {
        id: text,
        text
      };
      return [...state, notification];
    });
  };

  const clear = () => {
    update(() => []);
  };

  return {
    subscribe,
    add,
    addPermanent,
    remove,
    clear
  };
}
export const notifications = createNotificationsStore();
// #endregion Notifications Store


// #region RouteSaver Store
function createRouteSaverStore() {

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { subscribe, update } = writable<string>("/client/", set => {
    const savedCurrentPage = window.localStorage.getItem("currentPage");
    if (isExists(savedCurrentPage)) {
      set(savedCurrentPage);
    }
  });

  const set = (url: string) => {
    window.localStorage.setItem("currentPage", url);
    update(() => url);
  };

  const handleRouteLoaded = (e: CustomEvent<{ location: string }>) => {
    const { detail: { location } } = e;
    window.localStorage.setItem("currentPage", location);
    update(() => location);
  };

  const clean = () => {
    window.localStorage.removeItem("currentPage");
    update(() => "/client/");
  };

  return {
    subscribe,
    set,
    handleRouteLoaded,
    clean
  };
}
export const routeSaver = createRouteSaverStore();
// #endregion RouteSaver Store
