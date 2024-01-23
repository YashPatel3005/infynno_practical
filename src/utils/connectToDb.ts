import mongoose from "mongoose";
import config from "config";

async function connectToDb() {
  const dbUri = config.get<string>("dbUri");

  mongoose.connect(dbUri);

  mongoose.connection.on("connected", function () {
    console.log("Database Connection Established.");
  });

  mongoose.connection.on("error", function (err) {
    console.log("Mongodb connection failed. " + err);
    mongoose.disconnect();
  });
}

export default connectToDb;
