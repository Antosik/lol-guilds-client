import { rpc } from "./data/rpc";


async function handleWindowControls() {
  const toggleMaximized = async () => {
    const isMaximized = await rpc.invoke("app:window:isMaximized");
    if (isMaximized) {
      document.body.classList.add("window-maximized");
    } else {
      document.body.classList.remove("window-maximized");
    }
  };

  const onHide = () => rpc.send("app:window:minimize");
  const onMaximize = async () => { rpc.send("app:window:maximize"); await toggleMaximized(); };
  const onUnmaximize = async () => { rpc.send("app:window:unmaximize"); await toggleMaximized(); };
  const onClose = () => rpc.send("app:window:close");

  document.getElementById("hide-button")!.addEventListener("click", onHide);
  document.getElementById("unmaximize-button")!.addEventListener("click", onUnmaximize);
  document.getElementById("maximize-button")!.addEventListener("click", onMaximize);
  document.getElementById("close-button")!.addEventListener("click", onClose);

  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  await toggleMaximized();
}

window.LGC = {
  currentLocale: rpc.sendSync<string>("app:i18n:locale"),
  locales: rpc.sendSync<Record<string, IKeyValue>>("app:i18n:load")
};

document.addEventListener("DOMContentLoaded", async () => {
  await handleWindowControls();
});
