import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "default-avatar-url.jpg",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    Mycodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userCode",
      },
    ],
    resetpasswordtoken: {
      type: String,
    },
    resetpasswordexpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
