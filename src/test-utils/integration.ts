import express from "express";
import type { Request, Response } from "express";

// Helper to adapt a Next.js route GET handler: (req: NextRequest, ctx?) => NextResponse
// We ignore the real NextRequest and pass minimal stubs; handler returns a Response-like
export function createApp(routes: Array<{ path: string; handler: Function }>) {
  const app = express();
  app.use(express.json());

  for (const { path, handler } of routes) {
    app.get(path, async (req: Request, res: Response) => {
      try {
        // Build a ctx.params Promise like Next.js provides
        const ctx = req.params
          ? { params: Promise.resolve(req.params as any) }
          : undefined;
        const nextReq = {} as any;
        const nextRes: any = await (ctx ? handler(nextReq, ctx) : handler(nextReq));
        const bodyText = await nextRes.text();
        res.status(nextRes.status).type("application/json").send(bodyText);
      } catch (e: any) {
        res.status(500).json({ ok: false, error: String(e?.message || e) });
      }
    });
  }

  return app;
}
