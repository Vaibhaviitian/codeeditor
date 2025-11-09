import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.PORT);
const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connection Successful`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
