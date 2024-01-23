import mongoose, { Schema } from "mongoose";

import { generateToken } from "../utils/tokenUtils";
import { hashPassword } from "../utils/passwordUtils";

import { TokenPayload } from "../interfaces/UserInterface";
import { IUser } from "../interfaces/UserInterface";

import { setCurrentTimestamp } from "../helpers/dateFunction";

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Number, default: setCurrentTimestamp },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await hashPassword(this.password);
      this.password = hashedPassword;
    } catch (error) {
      console.log("Getting error while hashing a password", error);
      return next(error);
    }
  }
  next();
});

// for generating token
userSchema.methods.generateAuthToken = function (): string {
  const payload: TokenPayload = {
    userId: this._id.toString(),
    username: this.username,
  };

  return generateToken(payload);
};

const User = mongoose.model<IUser>("user", userSchema);

export default User;
