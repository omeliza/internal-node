import Fastify from "fastify";
import got from "got";
import NodeCache from "node-cache";

const fastify = Fastify({
  logger: true,
});
const appCache = new NodeCache();

fastify.get("/crypto", async function (_req, res) {
  try {
    let tickerPrice = appCache.get("24hrTickerPrice");

    if (tickerPrice == null) {
      const response = await got("<https://api2.binance.com/api/v3/ticker/24hr>");
      tickerPrice = response.body;

      appCache.set("24hrTickerPrice", tickerPrice, 300);
    }

    res
      .header("Content-Type", "application/json; charset=utf-8")
      .send(tickerPrice);
  } catch (err) {
    fastify.log.error(err);
    res.code(err.response.code).send(err.response.body);
  }
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
