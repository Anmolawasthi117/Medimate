import express from 'express';
import cors from 'cors';
import logger from "./utils/logger.js";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';


const app = express();
const morganFormat = ":method :url :status :response-time ms";

// Common Middleware
app.use(express.json({limit:"16kb"})); //for parsing the json
app.use(express.urlencoded({extended:true,limit:"16kb"})); // for ulrencoding
app.use(
    cors({
        origin:process.env.CORS_ORIGIN,
        credentials:true
})); // for cors
app.use(express.static("public")); 
app.use(cookieParser()); 
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
); // for logger



// Basic route
app.get('/', (req, res) => {
  res.send('Hello medimate app');
  logger.info("Hello medimate app");
});

// importing routes
import healthcheackRouter from "./routes/healthcheack.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import logRoutes from "./routes/log.routes.js";

// creating routes
app.use("/api/v1/healthcheack", healthcheackRouter);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/logs", logRoutes);

export {app};