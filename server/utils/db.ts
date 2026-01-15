import mongoose from "mongoose"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables.")
}

let connectionPromise: Promise<typeof mongoose> | null = null

export const connectToDatabase = async () => {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      dbName
    })
  }

  return connectionPromise
}
