// import path from 'path'
// import { DataSource } from 'typeorm'
// import { SOURCE_DIR } from '../constants/dirs.js'
// import { APP_NAME } from '../constants/env.js'

// export const database = new DataSource({
//   type: 'postgres',
//   url: process.env.DATABASE_URL,
//   entities: [path.join(SOURCE_DIR, 'entities', '*')],
//   migrations: [path.join(SOURCE_DIR, 'migrations', '*')],
//   applicationName: APP_NAME,
//   logger: 'advanced-console',
//   logging: 'all',
//   migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
// })

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
    const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/techlab";
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
