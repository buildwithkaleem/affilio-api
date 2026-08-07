import dbConnection from "../src/config/db.js";
import app from "../src/server.js";

await dbConnection()

export default app
