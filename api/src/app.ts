import express from "express";
import cors from "cors";
import { ALLOWED_ORIGINS } from "./config";
import { contentRouter } from "./routes/content";
import { contactRouter } from "./routes/contact";
import { authRouter } from "./routes/authRoutes";
import { adminRouter } from "./routes/admin";

export function createApp() {
  const app = express();

  // CORS — libera apenas as origens conhecidas (site + www + localhost dev).
  const corsOptions: cors.CorsOptions = {
    origin(origin, cb) {
      // Permite ferramentas sem Origin (curl/health) e as origens da allowlist.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`Origin não permitida pelo CORS: ${origin}`));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 86400,
  };
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  app.use(express.json({ limit: "2mb" }));

  // Health check (EasyPanel / uptime).
  app.get("/health", (_req, res) => res.json({ ok: true, service: "sema-api" }));
  app.get("/", (_req, res) => res.json({ service: "sema-api", status: "online" }));

  app.use("/content", contentRouter);
  app.use("/contact", contactRouter);
  app.use("/auth", authRouter);
  app.use("/admin", adminRouter);

  // 404
  app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada." }));

  // Handler de erro (inclui rejeição de CORS).
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      const status = err.message?.includes("CORS") ? 403 : 500;
      res.status(status).json({ error: err.message ?? "Erro interno." });
    }
  );

  return app;
}
