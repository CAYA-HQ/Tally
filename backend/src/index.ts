import dotenv from "dotenv";
dotenv.config();
import express from "express";
import api from "./routes/api";
import cors from "cors"
import { connectDB } from "./config/db";
import { errorHandler } from "./utils/errorHandler";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", api)

//Check endpoint
app.get("/", (req, res) => {
  res.send("API running 🚀");
});
// 404 handler
app.all(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

