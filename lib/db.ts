import mongoose from "mongoose";
import { MongoClient } from "mongodb";

export const DB_NAME = "axcvia";

// Cache connections across hot reloads and warm serverless invocations.
const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: Promise<typeof mongoose>;
  _mongoClient?: MongoClient;
};

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalWithMongoose._mongoose ??= mongoose
    .connect(uri, { dbName: DB_NAME, serverSelectionTimeoutMS: 10000 })
    .catch((err) => {
      // Don't cache a rejected promise — let the next request retry.
      globalWithMongoose._mongoose = undefined;
      throw err;
    });
  return globalWithMongoose._mongoose;
}

/**
 * Native driver client for Better Auth (lib/auth.ts), which needs a `Db`
 * handle at startup. The driver connects lazily on the first query, so this
 * is safe to call at build time when MONGODB_URI may be absent.
 */
export function getMongoClient() {
  globalWithMongoose._mongoClient ??= new MongoClient(process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017", {
    serverSelectionTimeoutMS: 10000,
  });
  return globalWithMongoose._mongoClient;
}
