import mongoose from "mongoose";
interface IDatabaseConfig {
  user?: string;
  password?: string;
  databaseName?: string;
  host?: string;
}

export default {
  async connect(config?: IDatabaseConfig) {
    console.log("Connecting to database...");
    const uri = process.env.DATABASE_URL || "mongodb://mongodb:27017/database";
    try {
      await mongoose.connect(uri);
      console.log("Database successfully connected!");
    } catch (error) {
      console.error("Error connecting to database: ", error);
    }
  },

  disconnect() {
    return mongoose.disconnect();
  }
};
