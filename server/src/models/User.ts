import mongoose from "mongoose";

interface IUserSchema {
  username: string;
  email: string;
  password: string;
  savedCodes: Array<mongoose.Types.ObjectId>;
}

const UserSchema = new mongoose.Schema<IUserSchema>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    savedCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Code" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
