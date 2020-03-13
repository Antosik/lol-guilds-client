import { app } from "electron";

import { api as guildAPI } from "./api/guilds";

import { createLCUAPIClient } from "./api/lcu";
import { createRPC } from "./data/rpc";
import { createWindow } from "./ui/window";

function main() {
  const window = createWindow();
  const rpc = createRPC(window);
  const lcuClient = createLCUAPIClient(rpc);

  async function getBasicLCUInfo() {
    const [summoner, gameflow, token] = await Promise.all([
      lcuClient.getCurrentSummoner(),
      lcuClient.getStatus(),
      lcuClient.getIdToken(),
    ]);
    return { summoner, gameflow, token };
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

      const guildsMe = await guildAPI.getMe(token);
      rpc.send("guilds:club", guildsMe.prev);
      const guildMembers = await guildAPI.getGuildMembers(guildsMe.prev.id, token);
      rpc.send("guilds:members", guildMembers);
    }
  });

  rpc.on("lcu:connect", async () => {
    rpc.send("lcu:connect");
    lcuClient.api.subscribe("/lol-gameflow/v1/gameflow-phase");
    lcuClient.api.subscribeInternal("/lol-service-status/v1/lcu-status");

    const { summoner, gameflow, token } = await getBasicLCUInfo();
    rpc.send("lcu:summoner", summoner);
    rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });

    const guildsMe = await guildAPI.getMe(token);
    rpc.send("guilds:club", guildsMe.prev);

    const guildMembers = await guildAPI.getGuildMembers(guildsMe.prev.id, token);
    rpc.send("guilds:members", guildMembers);
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
