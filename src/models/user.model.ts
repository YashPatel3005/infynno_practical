import mongoose, { Document, Schema } from "mongoose";
import { generateToken, TokenPayload } from "../utils/tokenUtils";

// Need to take in separate file
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  tokens: [
    {
      token: string;
    }
  ];
  generateAuthToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// userSchema.pre<IUser>("save", async function (next) {
//   if (this.isModified("password")) {
//     try {
//       const hashedPassword = await hashPassword(this.password);
//       this.password = hashedPassword;
//     } catch (error) {
//       console.log("Getting error while hashing a password", error);
//       return next(error);
//     }
//   }

//   next();
// });

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
