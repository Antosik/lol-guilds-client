import type { IKeyValue } from "@guilds-shared/interfaces/IKeyValue";

import { app } from "electron";

import { api as guildAPI } from "./api/guilds";
import { createLCUSession, constructInvitation } from "./api/lcu";
import { createRPC } from "./data/rpc";
import { createStore } from "./data/store";
import { createWindow } from "./ui/window";

function main() {
  const window = createWindow();
  const rpc = createRPC(window);
  const session = createLCUSession(rpc);
  const store = createStore();

  window.once("show", async () => {
    await session.connect();
  });

  rpc.on("ui:reconnect", async () => {
    await session.connect();
  });

  rpc.on("lcu:connect", async () => {
    session.subscribe("/lol-gameflow/v1/gameflow-phase");
    session.subscribe("/lol-service-status/v1/lcu-status", true);

    const [summoner, gameflow, idToken] = await Promise.all([
      session.request("/lol-summoner/v1/current-summoner"),
      session.request("/lol-gameflow/v1/gameflow-phase"),
      session.request("/lol-rso-auth/v1/authorization/id-token")
    ]);
    rpc.send("lcu:summoner", summoner);
    rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });

    const token: string = (idToken as IKeyValue).token;

    store.set({ token });
    store.set({
      summoner: {
        displayName: (summoner as IKeyValue).displayName,
        puuid: (summoner as IKeyValue).puuid,
        accountId: (summoner as IKeyValue).accountId,
        summonerId: (summoner as IKeyValue).summonerId,
      }
    });

    const guildsMe = await guildAPI.getMe(token);
    rpc.send("guilds:club", guildsMe.prev);

    const guildMembers = await guildAPI.getGuildMembers(guildsMe.prev.id, token);
    rpc.send("guilds:members", guildMembers);
  });

  rpc.on("guilds:member:invite", async (nickname: string) => {
    if (session.credentials !== undefined) {
      const summoner = await session.request(`/lol-summoner/v1/summoners?name=${encodeURI(nickname)}`);
      const summonerId: number = (summoner as IKeyValue).summonerId;
      const body = [constructInvitation(summonerId)];
      await session.request("lol-lobby/v2/lobby/invitations", body, "POST");
    }
  });
  rpc.on("guilds:member:invite-all", async (nicknames: string[]) => {
    if (session.credentials !== undefined) {
      const accounts = await Promise.all(nicknames.map((nickname: string) => session.request(`/lol-summoner/v1/summoners?name=${encodeURI(nickname)}`)));
      const summonerIds: number[] = (accounts as IKeyValue[]).map(account => account.summonerId);
      const body = summonerIds.map(constructInvitation);
      await session.request("lol-lobby/v2/lobby/invitations", body, "POST");
    }
  });
}

app.on("ready", main);

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});
