import "dotenv/config";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Inventory Management API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error.message);
    process.exit(1);
  }
};

startServer();
