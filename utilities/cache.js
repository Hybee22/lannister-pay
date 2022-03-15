import { getClient } from "../redis/index.js";
import Logger from "../logger.js";
const logger = Logger;

const client = getClient();
await client.connect();

class Cache {
  async set(key, data) {
    await client.set(key, JSON.stringify(data));
  }

  async get(key) {
    const res = await client.get(key);
    return res && JSON.parse(res);
  }

  async del(key) {
    const res = await client.del(key);
    return res;
  }

  async reset(key, query) {
    try {
      const res = await client.get(key);
      const obj = JSON.parse(res);
      if (obj) {
        await client.del(key);
      }
      // Clearing and Resetting cache data... ✔
      await query;
    } catch (err) {
      logger.error(JSON.stringify(err));
      return err;
    }
    return null;
  }

  async flushAll() {
    await client.flushAll();
  }
}

export default new Cache();
