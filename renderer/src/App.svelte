<script lang="typescript">
  import { Result } from '@guilds-shared/helpers/result';

  import { onMount, onDestroy } from 'svelte';
  import Router, { replace } from 'svelte-spa-router';

  import { rpc } from './data/rpc';
  import { appStore } from './store/app';
  import { summonerStore } from './store/summoner';
  import { guildStore } from './store/guild';
  import { routes } from './routes';

  import Invitations from './sections/Invitations.svelte';
  import Notifications from './sections/Notifications.svelte';
  import Version from './sections/Version.svelte';

  const handleRouting = (
    auth: boolean,
    summoner?: ILCUAPISummonerResponse | null,
  ) => {
    if (!auth) {
      replace('/not-launched/');
    } else if (auth && !summoner) {
      replace('/summoner-loading/');
    } else {
      replace($appStore.currentPage);
    }
  };

  $: handleRouting($summonerStore.auth, $summonerStore.summoner);

  const onNotificationClose = (e: Event) => {
    appStore.removeNotification((e as CustomEvent).detail);
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
  const onGuilds = async () => {
    const club = await rpc.invoke<IGuildAPIClubResponse>('guilds:club');
    guildStore.setGuildData(club);

    const summoner = $summonerStore.summoner;
    if (club && summoner) {
      const role = await rpc.invoke<number>(
        'guilds:role',
        club.id,
        summoner.displayName,
      );
      guildStore.setRole(role);
    }
  };
  const onOnlineChange = () =>
    rpc.send(navigator.onLine ? 'lcu:connect' : 'lcu:disconnect');
  const onInvitationAccept = async (e: Event) => {
    const invitationid = (e as CustomEvent<string>).detail;
    appStore.removeInvitation(invitationid);
    await rpc.invoke('lcu:invitation:accept', invitationid);
  };
  const onInvitationDecline = async (e: Event) => {
    const invitationid = (e as CustomEvent<string>).detail;
    appStore.removeInvitation(invitationid);
    await rpc.invoke('lcu:invitation:decline', invitationid);
  };
  const onReceivedInvitation = (e: Result<IInternalReceivedInvitation[]>) => {
    if (e.data === undefined || e.data.length === 0) {
      appStore.clearInvitations();
      return;
    }

    e.data
      .filter(
        (invite) =>
          $appStore.invitations.find(
            (invitation) => invitation.id === invite.invitationId,
          ) === undefined,
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

    window.removeEventListener('online', onOnlineChange);
    window.removeEventListener('offline', onOnlineChange);
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
