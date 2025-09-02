import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = Number(process.env.PORT || 3001);
const INSTANCE_NAME = process.env.INSTANCE_NAME || "backend-unknown";

// identify which replica served the request
app.use((_req, res, next) => {
  res.setHeader("X-Backend-Instance", INSTANCE_NAME);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, instance: INSTANCE_NAME });
});

// proxy to JSONPlaceholder
app.get("/api/posts", async (_req, res) => {
  const r = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await r.json();
  res.json({ instance: INSTANCE_NAME, data });
});

app.get("/api/posts/:id", async (req, res) => {
  const r = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${req.params.id}`
  );
  const data = await r.json();
  res.json({ instance: INSTANCE_NAME, data });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[${INSTANCE_NAME}] listening on ${PORT}`);
});
