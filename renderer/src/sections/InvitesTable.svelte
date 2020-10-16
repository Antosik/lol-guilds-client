<script context="module" lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import { isEmpty, isExists } from "@guilds-shared/helpers/typeguards";
  import IconButton from "@guilds-web/components/IconButton.svelte";
</script>

<script lang="typescript">
  export let invites: IInternalInvite[] = [];
  export let sortKey: string = "+id";

  const dispatch = createEventDispatcher();
  const acceptInvite = (id: number) => dispatch("invite-accept", id);
  const declineInvite = (id: number) => dispatch("invite-decline", id);
  const changeSort = (key: string) => {
    const newSortKey =
      sortKey.includes(key) && sortKey[0] === "+" ? `-${key}` : `+${key}`;
    dispatch("sort-change", newSortKey);
  };
  const sendFriendRequest = (nickname: string) => {
    dispatch("friend-request", nickname);
  };
</script>

<style>
  table {
    width: 100%;
    border-spacing: 0;
  }
  table td {
    text-align: center;
    padding: 8px;
  }
  table td:nth-child(2) {
    text-align: left;
  }
  h4 {
    text-align: center;
    margin: 20px;
  }
  th.sort-asc:after {
    content: " (↑)";
  }
  th.sort-desc:after {
    content: " (↓)";
  }
  tr {
    position: relative;
  }
  tr:not(:first-child):after {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      to right,
      rgba(245, 240, 223, 0) 0%,
      rgba(245, 240, 223, 0.2) 25%,
      rgba(245, 240, 223, 0.2) 75%,
      rgba(245, 240, 223, 0) 100%
    );
  }
  tbody tr:hover {
    background: rgba(245, 240, 223, 0.1);
  }
  .invite-actions {
    display: flex;
    gap: 4px;
  }
  :global(.invite-action:disabled.selected) {
    background: var(--main-background);
  }
</style>

{#if isEmpty(invites)}
  <h4>{$_('not-found.invites')}</h4>
{:else}
  <table>

    <thead>
      <tr>
        <th
          class:sort-asc={sortKey === '+id'}
          class:sort-desc={sortKey === '-id'}
          on:click={() => changeSort('id')}>
          #
        </th>
        <th
          class:sort-asc={sortKey === '+displayName'}
          class:sort-desc={sortKey === '-displayName'}
          on:click={() => changeSort('displayName')}>
          {$_('guild-invites.player-displayName')}
        </th>
        <th
          class:sort-asc={sortKey === '+level'}
          class:sort-desc={sortKey === '-level'}
          on:click={() => changeSort('level')}>
          {$_('guild-invites.player-level')}
        </th>
        <th
          class:sort-asc={sortKey === '+rank'}
          class:sort-desc={sortKey === '-rank'}
          on:click={() => changeSort('rank')}>
          {$_('guild-invites.player-rank')}
        </th>
        <th
          class:sort-asc={sortKey === '+points'}
          class:sort-desc={sortKey === '-points'}
          on:click={() => changeSort('points')}>
          {$_('guild-invites.player-points')}
        </th>
        <td />
      </tr>
    </thead>

    <tbody>
      {#each invites as invite, i (invite.id)}
        <tr>
          <td>{i + 1}</td>
          <td>{invite.displayName}</td>
          <td>{invite.level}</td>
          <td>{$_(`ranked.${invite.rank}`)}</td>
          <td>{invite.points}pt</td>
          <td>
            <ul class="invite-actions">
              <li>
                <IconButton
                  icon="ok"
                  alt={$_('guild-invites.accept-invite')}
                  rounded
                  className={invite.status === 1 ? "invite-action selected" : "invite-action"}
                  disabled={isExists(invite.status) && invite.status !== 0}
                  on:click={() => acceptInvite(invite.id)} />
              </li>
              <li>
                <IconButton
                  icon="close"
                  alt={$_('guild-invites.decline-invite')}
                  rounded
                  className={invite.status === 2 ? "invite-action selected" : "invite-action"}
                  disabled={isExists(invite.status) && invite.status !== 0}
                  on:click={() => declineInvite(invite.id)} />
              </li>
              {#if !invite.isFriend}
                <li>
                  <IconButton
                    icon="invite-user"
                    alt={$_('send.friend-request')}
                    rounded
                    disabled={isExists(invite.status) && invite.status !== 0}
                    on:click={() => sendFriendRequest(invite.displayName)} />
                </li>
              {/if}
            </ul>
          </td>
        </tr>
      {/each}
    </tbody>

  </table>
{/if}
