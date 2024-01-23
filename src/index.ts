import express from "express";
import http from "http";
import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import compression from "compression";
import cors from "cors";
import config from "config";
import connectToDb from "./utils/connectToDb";
import { seedUsers } from "./seeds/seed-users";
import router from "./routes";

connectToDb();

const app = express();

seedUsers();

app.use(
  cors({
    credentials: true,
  })
);

// app.use(compression());
// app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/v1", router);

const server = http.createServer(app);

const port = config.get<number>("port");

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
