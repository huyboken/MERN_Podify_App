import express from "express";
import "dotenv/config";
import "./db";
import { PORT } from "./utils/variables";
import authRouter from "./routers/auth";

const app = express();

//Register our middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log("Port is listening on port " + PORT);
});
