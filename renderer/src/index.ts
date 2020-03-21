import { shell } from "electron";
import App from "./App.svelte";

document.addEventListener("click", function (event) {
  if (event?.target) {
    const target = event.target as HTMLLinkElement;
    if (target.tagName === "A" && target.href.startsWith("http")) {
      event.preventDefault();
      shell.openExternal(target.href);
    }
  }
});

const app = new App({
  target: document.getElementById("app") || document.body
});

export default app;
