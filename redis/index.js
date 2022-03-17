import dotenv from "dotenv";
dotenv.config();

import redis, { createClient } from "redis";
import bluebird from "bluebird";

import Logger from "../logger.js";
const logger = Logger;

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration from env
let clientConfig = {
  host: process.env.LANNISTER_REDIS_HOST,
  port: process.env.LANISTER_REDIS_PORT,
};

if (process.env.LANNISTER_REDIS_PASSWORD !== "null") {
  clientConfig.password = process.env.LANNISTER_REDIS_PASSWORD;
}

if (process.env.NODE_ENV === "production") {
  clientConfig = {
    url: process.env.LANNISTER_REDIS_LIVE_HOST,
  };
}

const client = createClient(clientConfig);

// This is a catch all basic error handler.
client.on("error", (error) => {
  if (typeof error === "string") logger.error(error);
  else logger.error(JSON.stringify(error));
});

export function getClient() {
  return client;
}
