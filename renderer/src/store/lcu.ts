import { rpc } from "@guilds-web/data/rpc";
import { readable } from "svelte/store";


export const lcuConnected = readable<boolean>(false, set => {

  const onConnect = () => set(true);
  const onDisconnect = () => set(false);

  rpc.addListener("lcu:connected", onConnect);
  rpc.addListener("lcu:disconnected", onDisconnect);

  return () => {
    rpc.removeListener("lcu:connected", onConnect);
    rpc.removeListener("lcu:disconnected", onDisconnect);
  };
});