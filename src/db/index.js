import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `mongo DB connected successfully to ${connectionInstance.connection.host}:${connectionInstance.connection.port}/${DB_NAME}`
    );
  } catch (error) {
    console.error("error connecting to Mongo DB", error);
    process.exit(1);
  }
};

export default connectDB;
