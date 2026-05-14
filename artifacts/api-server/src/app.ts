import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

/* ── Security headers ── */
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

/* ── CORS — restreint au domaine de production + dev local ── */
const allowedOrigins = [
  "https://www.maitrezonon666.com",
  "https://maitrezonon666.com",
  /\.replit\.app$/,
  /\.repl\.co$/,
  /\.onrender\.com$/,   // domaine Render (dev + production)
];
app.use(cors({
  origin: (origin, cb) => {
    // Pas d'Origin = même origine ou curl → autorisé
    if (!origin) return cb(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    cb(allowed ? null : new Error("CORS: origine non autorisée"), allowed);
  },
  credentials: true,
}));

/* ── Logging ── */
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);

/* ── Body parsing — limite haute sur /api/settings seulement ── */
app.use("/api/settings", express.json({ limit: "20mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", router);

/* ── Static (production Render) ── */
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../../voyance-site/dist/public");
  app.use(express.static(staticPath, {
    maxAge: "7d",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
    },
  }));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

export default app;
