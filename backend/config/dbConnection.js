import mongoose from "mongoose";
const connectDB = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}
export default connectDB;