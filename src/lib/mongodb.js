import { MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB || "meahs_website";

const globalForMongo = globalThis;

let clientPromise = globalForMongo.__mongoClientPromise;

if (!clientPromise) {
  globalForMongo.__mongoClientPromise = null;
}

export async function getDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (!globalForMongo.__mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    globalForMongo.__mongoClientPromise = client.connect();
  }

  clientPromise = globalForMongo.__mongoClientPromise;
  const client = await clientPromise;
  return client.db(dbName);
}
