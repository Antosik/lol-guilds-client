<script>
  import { createEventDispatcher } from 'svelte';

  export let invites = [];

  const dispatch = createEventDispatcher();
  const acceptInvite = (id) => dispatch('invite-accept', id);
  const declineInvite = (id) => dispatch('invite-decline', id);

  const ranks = [
    'Железо',
    'Бронза',
    'Серебро',
    'Золото',
    'Платина',
    'Алмаз',
    'Мастер',
    'Грандмастер',
    'Претендент',
  ];
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
  tr {
    position: relative;
  }
  tr:not(:first-child):after {
    content: '';
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
  .invite-action {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    padding: 0;
    margin: 4px;
  }
  .invite-action img {
    max-width: 50%;
    pointer-events: none;
  }
  .invite-action:disabled.selected {
    background: var(--main-background);
  }
</style>

{#if !invites.length}
  <h4>Нет заявок</h4>
{:else}
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Никнейм игрока</th>
        <th>Уровень</th>
        <th>Ранг</th>
        <th>Очков за прошлый сезон</th>
        <td />
      </tr>
    </thead>
    <tbody>
      {#each invites as invite, i (invite.id)}
        <tr>
          <td>{i + 1}</td>
          <td>{invite.displayName}</td>
          <td>{invite.level}</td>
          <td>{ranks[invite.rank]}</td>
          <td>{invite.points}</td>
          <td>
            <ul>
              <li>
                <button
                  class="invite-action flex-center"
                  class:selected={invite.status === 1}
                  type="button"
                  on:click={() => acceptInvite(invite.id)}
                  disabled={invite.status !== 0 && invite.status !== undefined}>
                  <img src="./images/icons/ok.svg" alt="Принять заявку" />
                </button>
              </li>
              <li>
                <button
                  class="invite-action flex-center"
                  class:selected={invite.status === 2}
                  type="button"
                  on:click={() => declineInvite(invite.id)}
                  disabled={invite.status !== 0 && invite.status !== undefined}>
                  <img src="./images/icons/close.svg" alt="Отклонить заявку" />
                </button>
              </li>
            </ul>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
