import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379",
});

export const redisClient = await client.connect();
