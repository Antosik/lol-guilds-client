<script>
  import { onMount, onDestroy } from 'svelte';
  import Router, { replace, location } from 'svelte-spa-router';

  import { rpc } from './data/rpc';
  import { appStore } from './store/app';
  import { summonerStore } from './store/summoner';
  import { guildStore } from './store/guild';
  import { routes } from './routes';

  import Invitations from './sections/Invitations';
  import Notifications from './sections/Notifications';
  import Version from './sections/Version';

  const handleRouting = (auth, summoner) => {
    if (!auth) {
      replace('/not-launched/');
    } else if (auth && !summoner) {
      replace('/summoner-loading/');
    } else {
      replace($appStore.currentPage);
    }
  };

  $: handleRouting($summonerStore.auth, $summonerStore.summoner);

  const onNotificationClose = (e) => appStore.removeNotification(e.detail);
  const onSummoner = (e) => summonerStore.setSummoner(e);
  const onGameflow = (e) => summonerStore.setStatus(e.data);
  const onConnect = (e) => {
    guildStore.reset();
    summonerStore.setAuth(true);
  };
  const onDisconnect = (e) => {
    guildStore.reset();
    summonerStore.setAuth(false);
  };
  const onGuilds = async (e) => {
    const club = await rpc.invoke('guilds:club');
    guildStore.setGuildData(club);

    if (club) {
      const role = await rpc.invoke(
        'guilds:role',
        club.id,
        $summonerStore.summoner.displayName,
      );
      guildStore.setRole(role);
    }
  };
  const onOnlineChange = () =>
    rpc.send(navigator.onLine ? 'lcu:connect' : 'lcu:disconnect');
  const onInvitationAccept = async (e) => {
    appStore.removeInvitation(e.detail);
    await rpc.invoke('lcu:invitation:accept', e.detail);
  };
  const onInvitationDecline = async (e) => {
    appStore.removeInvitation(e.detail);
    await rpc.invoke('lcu:invitation:decline', e.detail);
  };
  const onReceivedInvitation = (invites) => {
    if (invites.length === 0) {
      appStore.clearInvitations();
    }

    invites
      .filter(
        (invite) =>
          $appStore.invitations.find((invitation) => invitation.id === invitationId) ===
          undefined,
      )
      .forEach((invite) => {
        appStore.addInvitation(
          invite.invitationId,
          `Приглашение в лобби от согильдийца ${invite.fromSummonerName}`,
        );
        new Notification('League Guilds Client', {
          lang: 'ru-RU',
          body: `Приглашение в лобби от согильдийца ${invite.fromSummonerName}`,
        });
      });
  };

  onMount(() => {
    rpc.invoke('lcu:connect');

    rpc.on('lcu:connected', onConnect);
    rpc.on('lcu:disconnected', onDisconnect);
    rpc.on('lcu:summoner', onSummoner);
    rpc.on('lcu:gameflow-phase', onGameflow);
    rpc.on('lcu:invitations', onReceivedInvitation);
    rpc.on('guilds:connected', onGuilds);

    window.addEventListener('online', onOnlineChange);
    window.addEventListener('offline', onOnlineChange);
  });

  onDestroy(() => {
    rpc.removeListener('lcu:connected', onConnect);
    rpc.removeListener('lcu:disconnected', onDisconnect);
    rpc.removeListener('lcu:summoner', onSummoner);
    rpc.removeListener('lcu:gameflow-phase', onGameflow);
    rpc.removeListener('lcu:invitations', onReceivedInvitation);
    rpc.removeListener('guilds:connected', onGuilds);

    window.removeListener('online', onOnlineChange);
    window.removeListener('offline', onOnlineChange);
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
</style>

<Router {routes} />
<Version />

<div class="notifications">
  <Notifications
    notifications={$appStore.notifications}
    on:notification-close={onNotificationClose} />
  <Invitations
    invitations={$appStore.invitations}
    on:invite-accept={onInvitationAccept}
    on:invite-decline={onInvitationDecline} />
</div>
