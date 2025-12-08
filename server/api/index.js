import app from "../src/app.js";
import connectDB from "../src/db/index.js";

let isConnected = false; // To prevent multiple DB connections on Vercel

export default async function handler(req, res) {
  // Connect to DB only once per cold start
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  // Let Express handle the request
  return app(req, res);
}
