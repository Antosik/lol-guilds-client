<script lang="typescript" context="module">
  import { onMount, onDestroy } from "svelte";
  import { _, init, addMessages } from "svelte-i18n";
  import Router, { replace } from "svelte-spa-router";

  import { Result } from "@guilds-shared/helpers/result";
  import {
    isNotExists,
    isExists,
    isEmpty,
    isNotBlank,
  } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "./data/rpc";
  import { appStore } from "./store/app";
  import { summonerStore } from "./store/summoner";
  import { guildStore } from "./store/guild";
  import { routes } from "./routes";

  import Modal from "./components/Modal.svelte";
  import Invitations from "./sections/Invitations.svelte";
  import Notifications from "./sections/Notifications.svelte";
  import SettingsModal from "./sections/SettingsModal.svelte";

  if (
    isExists(window.LGC) &&
    isNotBlank(window.LGC.currentLocale) &&
    isExists(window.LGC.locales)
  ) {
    const { locales, currentLocale } = window.LGC;

    Object.keys(locales).forEach((key) => {
      addMessages(key, locales[key]);
    });

    init({
      fallbackLocale: "en",
      initialLocale: currentLocale,
      loadingDelay: 0,
    });
  }

  const onNotificationClose = (e: CustomEvent<string>) => {
    appStore.removeNotification(e.detail);
  };
  const onSummoner = (e: Result<ILCUAPISummonerResponse>) => {
    summonerStore.setSummoner(e.data);
  };
  const onGameflow = (e: Result<string>) => summonerStore.setStatus(e.data);
  const onConnect = () => {
    guildStore.reset();
    summonerStore.setAuth(true);
  };
  const onDisconnect = () => {
    guildStore.reset();
    summonerStore.setAuth(false);
  };
  const onOnlineChange = () => {
    rpc.send(navigator.onLine ? "lcu:connect" : "lcu:disconnect");
  };
  const onInvitationAccept = async (e: CustomEvent<string>) => {
    const invitationid = e.detail;
    appStore.removeInvitation(invitationid);
    await rpc.invoke("lcu:invitation:accept", invitationid);
  };
  const onInvitationDecline = async (e: CustomEvent<string>) => {
    const invitationid = e.detail;
    appStore.removeInvitation(invitationid);
    await rpc.invoke("lcu:invitation:decline", invitationid);
  };
</script>

<script lang="typescript">
  const handleRouting = (
    auth: boolean,
    summoner?: ILCUAPISummonerResponse | null
  ) => {
    if (!auth) {
      replace("/not-launched/");
    } else if (auth && isNotExists(summoner)) {
      replace("/summoner-loading/");
    } else {
      const pageToRoute =
        $appStore.currentPage === "/not-launched/" ||
        $appStore.currentPage === "/summoner-loading/"
          ? "/client/"
          : $appStore.currentPage;
      replace(pageToRoute);
    }
  };

  $: handleRouting($summonerStore.auth, $summonerStore.summoner);
  let isSettingsModalOpen = false;

  const onSettingsModalOpen = () => (isSettingsModalOpen = true);
  const onSettingsModalClose = () => (isSettingsModalOpen = false);

  const onGuilds = async () => {
    const club = await rpc.invoke<IGuildAPIClubResponse>("guilds:club");
    guildStore.setGuildData(club);

    const summoner = $summonerStore.summoner;
    if (isExists(club) && isExists(summoner)) {
      const role = await rpc.invoke<number>(
        "guilds:role",
        club.id,
        summoner.displayName
      );
      guildStore.setRole(role);
    }
  };
  const onReceivedInvitation = (e: Result<IInternalReceivedInvitation[]>) => {
    if (isEmpty(e.data)) {
      appStore.clearInvitations();
      return;
    }

    e.data
      .filter((invite) => {
        const inviteFound = $appStore.invitations.find(
          (invitation) => invitation.id === invite.invitationId
        );
        return isNotExists(inviteFound);
      })
      .forEach((invite) => {
        const msg = `${$_("invite.from-guild-member")} ${
          invite.fromSummonerName
        }`;
        appStore.addInvitation(invite.invitationId, msg);
        new Notification("League Guilds Client", {
          lang: "ru-RU",
          body: msg,
        });
      });
  };

  onMount(() => {
    rpc.send("lcu:connect");

    rpc.addListener("lcu:connected", onConnect);
    rpc.addListener("lcu:disconnected", onDisconnect);
    rpc.addListener("lcu:summoner", onSummoner);
    rpc.addListener("lcu:gameflow-phase", onGameflow);
    rpc.addListener("lcu:invitations", onReceivedInvitation);
    rpc.addListener("guilds:connected", onGuilds);

    window.addEventListener("online", onOnlineChange);
    window.addEventListener("offline", onOnlineChange);
  });

  onDestroy(() => {
    rpc.removeListener("lcu:connected", onConnect);
    rpc.removeListener("lcu:disconnected", onDisconnect);
    rpc.removeListener("lcu:summoner", onSummoner);
    rpc.removeListener("lcu:gameflow-phase", onGameflow);
    rpc.removeListener("lcu:invitations", onReceivedInvitation);
    rpc.removeListener("guilds:connected", onGuilds);

    window.removeEventListener("online", onOnlineChange);
    window.removeEventListener("offline", onOnlineChange);
  });
</script>

<style>
  .notifications {
    position: fixed;
    top: 40px;
    right: 20px;
    max-width: 300px;
    min-width: 200px;
  }

  .settings-button {
    width: 30px;
    height: 30px;
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 0.25rem;
  }

  .settings-button__img {
    max-width: 100%;
  }
</style>

<Router {routes} />

<button
  type="button"
  class="flex-center settings-button"
  on:click={onSettingsModalOpen}>
  <img
    src="./images/icons/settings.svg"
    alt={$_('settings.head')}
    class="settings-button__img" />
</button>

<Modal isOpen={isSettingsModalOpen} on:close={onSettingsModalClose}>
  <h2 slot="heading">{$_('settings.head')}</h2>
  <SettingsModal />
</Modal>

<div class="notifications">
  <Notifications
    notifications={$appStore.notifications}
    on:notification-close={onNotificationClose} />
  <Invitations
    invitations={$appStore.invitations}
    on:invite-accept={onInvitationAccept}
    on:invite-decline={onInvitationDecline} />
</div>
