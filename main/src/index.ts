import { app } from "electron";

import { createGuildsAPIClient, GuildsClient } from "./api/guilds";
import { createLCUAPIClient } from "./api/lcu";
import { createRPC } from "./data/rpc";
import { createWindow } from "./ui/window";

function main() {
  const window = createWindow();
  const rpc = createRPC(window);
  const lcuClient = createLCUAPIClient(rpc);
  let guildsClient: GuildsClient;

  async function getBasicLCUInfo() {
    const [summoner, gameflow, token] = await Promise.all([
      lcuClient.getCurrentSummoner(),
      lcuClient.getStatus(),
      lcuClient.getIdToken(),
    ]);
    return { summoner, gameflow, token };
  }

  async function getBasicGuildsInfo() {
    if (guildsClient === undefined) {
      return { club: undefined, members: [] };
    }

    const [seasons, currentSummoner] = await Promise.all([
      guildsClient.api.getSeasons(),
      guildsClient.api.getCurrentSummoner()
    ]);

    const club = currentSummoner.next !== undefined
      ? currentSummoner.next
      : currentSummoner.club !== undefined
        ? currentSummoner.club : currentSummoner.prev;
    const liveSeason = seasons.find((s) => s.is_open && !s.is_closed);
    const season = liveSeason !== undefined ? liveSeason : seasons[seasons.length - 1];

    const [guildMembers, guildMembersStageRating] = await Promise.all([
      guildsClient.getGuildMembers(club?.id),
      guildsClient.getGuildMembersStageRating(season.id, club?.id)
    ]);

    return { seasons, season, club, members: guildMembers, membersStage: guildMembersStageRating };
  }

  window.once("show", async () => {
    await lcuClient.connect();
  });

  async function onLCUConnect() {
    if (!lcuClient.isConnected) {
      await lcuClient.connect();
    } else {
      rpc.send("lcu:connect");
      lcuClient.api.subscribe("/lol-gameflow/v1/gameflow-phase");
      lcuClient.api.subscribeInternal("/lol-service-status/v1/lcu-status");

      const { summoner, gameflow, token } = await getBasicLCUInfo();
      rpc.send("lcu:summoner", summoner);
      rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });

      guildsClient = createGuildsAPIClient(token);
      const { seasons, club, members, membersStage } = await getBasicGuildsInfo();
      rpc.send("guilds:club", club);
      rpc.send("guilds:members", members);
      rpc.send("guilds:members:stage", membersStage);
      rpc.send("guilds:seasons", seasons);
    }
  }

  rpc.on("ui:reconnect", onLCUConnect);
  rpc.on("lcu:connect", onLCUConnect);
  rpc.on("lcu:disconnect", () => rpc.send("lcu:disconnect"));

  rpc.on("guilds:member:invite", async (nickname: string) => {
    if (lcuClient.isConnected) {
      await lcuClient.sendInviteByNickname([nickname]);
    }
  });
  rpc.on("guilds:member:invite-all", async (nicknames: string[]) => {
    if (lcuClient.isConnected) {
      await lcuClient.sendInviteByNickname(nicknames);
    }
  });
}

app.on("ready", main);

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});
