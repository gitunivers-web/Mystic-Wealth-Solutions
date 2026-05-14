import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Self-ping pour empêcher la mise en veille sur Render (free tier)
  // Render met en veille après 15 min d'inactivité → on ping toutes les 14 min
  if (process.env.NODE_ENV === "production") {
    const baseUrl =
      process.env.RENDER_EXTERNAL_URL ||
      `http://localhost:${port}`;

    const pingUrl = `${baseUrl}/api/healthz`;
    const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

    const ping = async () => {
      try {
        const res = await fetch(pingUrl, {
          method: "GET",
          headers: { "User-Agent": "self-ping/1.0" },
          signal: AbortSignal.timeout(10_000),
        });
        logger.info({ status: res.status, url: pingUrl }, "Self-ping OK");
      } catch (pingErr) {
        logger.warn({ err: pingErr, url: pingUrl }, "Self-ping failed");
      }
    };

    // Premier ping 2 min après le démarrage, puis toutes les 14 min
    setTimeout(() => {
      ping();
      setInterval(ping, INTERVAL_MS);
    }, 2 * 60 * 1000);

    logger.info(
      { url: pingUrl, intervalMin: 14 },
      "Self-ping scheduled to prevent sleep",
    );
  }
});
