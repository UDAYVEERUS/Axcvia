import mongoose from "mongoose";

// Cache the connection across hot reloads and warm serverless invocations.
const globalWithMongoose = global as typeof globalThis & {
  _mongoose?: Promise<typeof mongoose>;
};

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalWithMongoose._mongoose ??= mongoose
    .connect(uri, { dbName: "axcvia", serverSelectionTimeoutMS: 10000 })
    .catch((err) => {
      // Don't cache a rejected promise — let the next request retry.
      globalWithMongoose._mongoose = undefined;
      throw err;
    });
  return globalWithMongoose._mongoose;
}
