import { app, shell } from "electron";

app.on("web-contents-created", (_, contents) => {
  contents.on("will-attach-webview", (event) => {
    event.preventDefault();
  });

  contents.on("will-navigate", (event, url) => {
    if (event.sender.history[event.sender.history.length - 1] !== url) {
      event.preventDefault();
    }
  });

  contents.on("new-window", (event, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  });
});

app.on("remote-require", (event) => {
  event.preventDefault();
});

app.on("remote-get-builtin", (event) => {
  event.preventDefault();
});

app.on("remote-get-global", (event) => {
  event.preventDefault();
});

app.on("remote-get-current-web-contents", (event) => {
  event.preventDefault();
});