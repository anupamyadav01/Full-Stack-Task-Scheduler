import { set, connect } from "mongoose";

const connectDB = async () => {
  set("strictQuery", false);
  try {
    const conn = await connect(process.env.MONGO_URI, {
      dbName: process.env.DB,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
