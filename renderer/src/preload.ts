import { remote } from "electron";

const win = remote.getCurrentWindow();

function handleWindowControls() {
  const toggleMaximized = () => {
    if (win.isMaximized()) {
      document.body.classList.add("window-maximized");
    } else {
      document.body.classList.remove("window-maximized");
    }
  };

  const onHide = () => win.minimize();
  const onMaximize = () => win.maximize();
  const onUnmaximize = () => win.unmaximize();
  const onClose = () => win.close();


  document.getElementById("hide-button")!.addEventListener("click", onHide);
  document.getElementById("unmaximize-button")!.addEventListener("click", onUnmaximize);
  document.getElementById("maximize-button")!.addEventListener("click", onMaximize);
  document.getElementById("close-button")!.addEventListener("click", onClose);

  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  toggleMaximized();
  win.on("maximize", toggleMaximized);
  win.on("unmaximize", toggleMaximized);
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    handleWindowControls();
  }
};

window.onbeforeunload = () => {
  win.removeAllListeners();
};