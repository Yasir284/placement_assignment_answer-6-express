import app from "./app.js";
import mongoose from "mongoose";

const { MONGODB_URL, PORT } = process.env;

(() => {
  try {
    mongoose.connect(MONGODB_URL);
    console.log("DB CONNECTION SUCCESSFUL");

    app.listen(PORT, () => console.log(`Listening at PORT:${PORT}`));
  } catch (err) {
    console.log(err);
    console.log("DB CONNECTION FAILED");
    process.exit(1);
  }
})();
