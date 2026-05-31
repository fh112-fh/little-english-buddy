import { createStaticServer, localAddresses } from "./static-server.mjs";

const port = Number(process.env.PORT || 4173);
const host = "0.0.0.0";
const server = createStaticServer();

server.listen(port, host, () => {
  const urls = localAddresses().map((address) => `http://${address}:${port}/`);
  console.log(`Local:   http://127.0.0.1:${port}/`);
  urls.forEach((url) => console.log(`Phone:   ${url}`));
});
