import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import config from "config";

import router from "./routes";

// To connect with database
import connectToDb from "./utils/connectToDb";
connectToDb();

import { seedUsers } from "./seeds/seed-users";
seedUsers();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// version v1
app.use("/v1", router);

const server = http.createServer(app);

const port = config.get<number>("port");

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
