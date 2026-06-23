import mongoose from "mongoose";

/**
 * Opens a connection to MongoDB using MONGODB_URI.
 *
 * On serverless platforms (Vercel) each function invocation can run in its own
 * isolated context, so a plain `mongoose.connect` per request would open a new
 * connection every time and exhaust the database. We cache the connection (and
 * the in-flight connection promise) on `global` so it survives between warm
 * invocations and concurrent calls reuse the same single connection.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// `global` persists across hot reloads in dev and warm invocations in prod.
const globalForMongoose = global as typeof globalThis & {
  _mongooseCache?: MongooseCache;
};

const cached: MongooseCache =
  globalForMongoose._mongooseCache ?? { conn: null, promise: null };
globalForMongoose._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Connection already established: reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // No connection yet but one may be in flight: reuse that single promise so
  // concurrent calls don't each start their own connection.
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log("DB Online");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset so the next call can retry instead of being stuck on a failed promise.
    cached.promise = null;
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Database connection failed: ${message}`);
  }

  return cached.conn;
}
