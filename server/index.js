import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongoDB/connect.js";

import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
  }

  app.listen(8080, () =>
    console.log("Server has started on port http://localhost:8080")
  );
};

startServer();

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/comment", commentRoutes);
