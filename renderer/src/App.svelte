<script lang="typescript" context="module">
  import { onMount, onDestroy } from "svelte";
  import { _, init, addMessages } from "svelte-i18n";
  import { replace } from "svelte-spa-router";
  import Router from "svelte-spa-router/Router.svelte";

  import { Result } from "@guilds-shared/helpers/result";
  import {
    isNotExists,
    isExists,
    isEmpty,
    isNotBlank,
  } from "@guilds-shared/helpers/typeguards";
  import { rpc } from "./data/rpc";
  import { invitations, notifications, routeSaver } from "./store/app";
  import { lcuConnected } from "./store/lcu";
  import { summoner, guildsConnected } from "./store";
  import { routes } from "./routes";

  import IconButton from "./components/IconButton.svelte";
  import Modal from "./components/Modal.svelte";
  import Invitations from "./sections/Invitations.svelte";
  import Notifications from "./sections/Notifications.svelte";
  import SettingsModal from "./sections/SettingsModal.svelte";
  import Version from "./sections/Version.svelte";

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
    notifications.remove(e.detail);
  };
  const onOnlineChange = () => {
    rpc.send(navigator.onLine ? "lcu:connect" : "lcu:disconnect");
  };
  const onInvitationAccept = async (e: CustomEvent<string>) => {
    const invitationid = e.detail;
    invitations.remove(invitationid);
    await rpc.invoke("lcu:invitation:accept", invitationid);
  };
  const onInvitationDecline = async (e: CustomEvent<string>) => {
    const invitationid = e.detail;
    invitations.remove(invitationid);
    await rpc.invoke("lcu:invitation:decline", invitationid);
  };
</script>

<script lang="typescript">
  const handleRouting = (
    auth: boolean,
    summoner: TSummonerStore
  ) => {
    if (!auth) {
      replace("/not-launched/");
    } else if (summoner.isLoading) {
      replace("/summoner-loading/");
    } else if (isNotExists(summoner.data)) {
      replace("/not-launched/");
    } else {
      const pageToRoute =
        $routeSaver === "/not-launched/" || $routeSaver === "/summoner-loading/"
          ? "/client/"
          : $routeSaver;
      replace(pageToRoute);
    }
  };

  $: handleRouting($guildsConnected, $summoner);
  let isSettingsModalOpen = false;

  const onSettingsModalOpen = () => (isSettingsModalOpen = true);
  const onSettingsModalClose = () => (isSettingsModalOpen = false);

  const onReceivedInvitation = (e: Result<IInternalReceivedInvitation[]>) => {
    if (isEmpty(e.data)) {
      invitations.clear();
      return;
    }

    e.data
      .filter((invite) => {
        const inviteFound = $invitations.find(
          (invitation) => invitation.id === invite.invitationId
        );
        return isNotExists(inviteFound);
      })
      .forEach((invite) => {
        const msg = `${$_("invite.from-guild-member")} ${
          invite.fromSummonerName
        }`;
        invitations.add(invite.invitationId, msg);
        new Notification("League Guilds Client", {
          lang: "ru-RU",
          body: msg,
        });
      });
  };

  onMount(() => {
    rpc.send("lcu:connect");
    rpc.send("guilds:connect");

    rpc.addListener("lcu:invitations", onReceivedInvitation);

    window.addEventListener("online", onOnlineChange);
    window.addEventListener("offline", onOnlineChange);
  });

  onDestroy(() => {
    rpc.removeListener("lcu:invitations", onReceivedInvitation);

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

  :global(.settings-button) {
    width: 30px !important;
    height: 30px !important;
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>

<Router {routes} />

<IconButton
  className="settings-button"
  icon="settings"
  alt={$_('settings.head')}
  on:click={onSettingsModalOpen} />

<Modal isOpen={isSettingsModalOpen} on:close={onSettingsModalClose}>
  <h2 slot="heading">{$_('settings.head')}</h2>
  <SettingsModal />
</Modal>

<div class="notifications">
  <Notifications
    notifications={$notifications}
    on:notification-close={onNotificationClose} />
  {#if $lcuConnected}
    <Invitations
      invitations={$invitations}
      on:invite-accept={onInvitationAccept}
      on:invite-decline={onInvitationDecline} />
  {/if}
</div>

<Version />
