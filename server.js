import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import axios from "axios";
import path from "path";
import exp from "constants";
import { fileURLToPath } from 'url'

//config env
dotenv.config();

//db connect
connectDB();

//for --> dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest obj
const app = express();

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.post("/authenticate", async (req, res) => {
  const { username } = req.body;
  try {
    const c = await axios.put(
      "https://api.chatengine.io/users/",
      { username: username, secret: username, first_name: username },
      { headers: { "private-key": "74cd38be-bb3f-42a5-81ee-62770ea960ee" } }
    );
    return res.status(c.status).json(c.data);
  } catch (e) {
    return res.status(500).send({ message: "error" });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {});
