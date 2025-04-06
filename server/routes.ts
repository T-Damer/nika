import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // This is a frontend-only application, so we don't need any API routes
  // All data will be stored in localStorage

  const httpServer = createServer(app);

  return httpServer;
}
