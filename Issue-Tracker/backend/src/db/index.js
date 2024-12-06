// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";


// const connectDB = async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error) {
//         console.log("MONGODB connection FAILED ", error);
//         process.exit(1)
//     }
// }

// export default connectDB

import mysql from "mysql2/promise";
import { DB_NAME } from "../constants.js";

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: DB_NAME,
    });
    console.log(`\n MySQL connected! DB HOST: ${process.env.DB_HOST}`);
  } catch (error) {
    console.error("MySQL connection FAILED:", error.message);
    process.exit(1);
  }
};

export const getConnection = () => connection;
export default connectDB;
