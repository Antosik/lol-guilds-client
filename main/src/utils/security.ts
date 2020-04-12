import { app, shell } from "electron";

app.on("web-contents-created", (_, contents) => {
  contents.on("will-attach-webview", (event) => {
    event.preventDefault();
  });

  contents.on("will-navigate", (event) => {
    event.preventDefault();
  });

  contents.on("new-window", (event, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  });
});