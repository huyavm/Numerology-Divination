import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { CLERK_PROXY_PATH, clerkProxyMiddleware } from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy — chỉ chạy trong production khi CLERK_SECRET_KEY được set
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// clerkMiddleware chỉ mount khi có CLERK_SECRET_KEY
// Khi thiếu key, /api/readings sẽ trả 401 nhưng server không crash
if (process.env.CLERK_SECRET_KEY) {
  app.use(clerkMiddleware());
} else {
  logger.warn("CLERK_SECRET_KEY not set — auth endpoints will return 401");
}

app.use("/api", router);

export default app;
