import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected...");
    });
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error("MongoDB Connection Error: ", error);
  }
};

export default dbconnect;
