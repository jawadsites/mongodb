import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL as string;

// Global cache for mongoose connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // If already connected, return the existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already being established, wait for it
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the DATABASE_URL environment variable");
  }

  try {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000,
    });

    cached.conn = await cached.promise;
    console.log("Database Connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log("Database Fail", error);
    throw error;
  }
};
