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

    const guildsMe = await guildsClient.getCurrentSummoner();
    const guildMembers = guildsMe.club?.id === undefined
      ? []
      : await guildsClient.getGuildMembers(guildsMe.club.id);

    return { club: guildsMe.club, members: guildMembers };
  }

  window.once("show", async () => {
    await lcuClient.connect();
  });

  rpc.on("ui:reconnect", async () => {
    if (!lcuClient.isConnected) {
      await lcuClient.connect();
    } else {
      rpc.send("lcu:connect");

      const { summoner, gameflow, token } = await getBasicLCUInfo();
      rpc.send("lcu:summoner", summoner);
      rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });

      guildsClient = createGuildsAPIClient(token);
      const { club, members } = await getBasicGuildsInfo();
      rpc.send("guilds:club", club);
      rpc.send("guilds:members", members);
    }
  });

  rpc.on("lcu:connect", async () => {
    rpc.send("lcu:connect");
    lcuClient.api.subscribe("/lol-gameflow/v1/gameflow-phase");
    lcuClient.api.subscribeInternal("/lol-service-status/v1/lcu-status");

    const { summoner, gameflow, token } = await getBasicLCUInfo();
    rpc.send("lcu:summoner", summoner);
    rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });

    guildsClient = createGuildsAPIClient(token);
    const { club, members } = await getBasicGuildsInfo();
    rpc.send("guilds:club", club);
    rpc.send("guilds:members", members);
  });

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
