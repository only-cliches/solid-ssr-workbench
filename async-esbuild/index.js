import express from "express";
import path from "path";
import compression from "compression";
import fetch from "node-fetch";

import { renderToStringAsync } from "solid-js/web";
import App from "../shared/src/App";

const app = express();
const port = 8080;
globalThis.fetch = fetch;

app.use(compression());
app.use(express.static(path.join(__dirname, "../public")));

app.get("*", async (req, res) => {
  let page;
  try {
    // preload(res, manifest[req.url]);
    // res.flushHeaders();
    page = await renderToStringAsync(() => <App url={req.url} />);
  } catch (err) {
    console.error(err);
  } finally {
    res.write(page);
    res.end();
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
