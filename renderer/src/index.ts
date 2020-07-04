/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app") ?? document.body
});

export default app;
