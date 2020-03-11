import { app } from "electron";

import { createLCUSession } from "./api/lcu";
import { createRPC } from "./data/rpc";
import { createWindow } from "./ui/window";

function main() {
  const window = createWindow();
  const rpc = createRPC(window);
  const session = createLCUSession(rpc);

  window.once("show", async () => {
    await session.connect();
  });

  rpc.on("ui:reconnect", async () => {
    await session.connect();
  });

  rpc.on("lcu:connect", async () => {
    session.subscribe("/lol-gameflow/v1/gameflow-phase");
    session.subscribe("/lol-service-status/v1/lcu-status", true);

    const [summoner, gameflow, token] = await Promise.all([
      session.request("/lol-summoner/v1/current-summoner"),
      session.request("/lol-gameflow/v1/gameflow-phase"),
      session.request("/lol-rso-auth/v1/authorization/id-token")
    ]);
    rpc.send("lcu:summoner", summoner);
    rpc.send("lcu:lol-gameflow.v1.gameflow-phase", { data: gameflow });
  });
}

app.on("ready", main);

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});
