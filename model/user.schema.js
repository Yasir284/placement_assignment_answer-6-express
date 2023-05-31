import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    default: null,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be more than 8 characters"],
  },
});

export default mongoose.model("user", userSchema);
