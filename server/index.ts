import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { multiProviderSyncScheduler } from "./services/sync/multi-provider-sync-scheduler";
import { statusScheduler } from "./services/sync/status-scheduler";
import { syncScheduler } from "./services/sync/sync-scheduler";
import path from "path";
import adminRouter from "./routes/admin"; // routes/admin/index.ts
import { registerModularRoutes } from "./routes/index";            // routes/index.ts
import { apiLimiter, authLimiter } from "./middleware/rateLimit";
import { initSocket } from "./socket";
// Register all eSIM providers with the factory (Airalo, eSIM Access, eSIM Go, Maya)
import "./providers/register";
import { startLowDataUsageCron } from "./cron/lowDataUsageCron";




const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

startLowDataUsageCron();

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});





(async () => {

  const server = await registerRoutes(app);
  initSocket(server);

  app.use("/api/admin", adminRouter);



  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
      success: false,
      message,
      code: err.code || "INTERNAL_ERROR",
    });
    console.error(err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  // server.listen({
  //   port,
  //   host: "0.0.0.0",
  //   reusePort: true,
  // }, () => {
  //   log(`serving on port ${port}`);

  //   // Start multi-provider package sync scheduler
  //   multiProviderSyncScheduler.start();

  //   // Start order status polling and retry scheduler
  //   statusScheduler.start();
  // });


  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
    multiProviderSyncScheduler.start();
    syncScheduler.start();
    statusScheduler.start();
  });

})();
