import User from "../models/user.model";
import config from "config";
import { hashPassword } from "../utils/passwordUtils";
import { IUser } from "../models/user.model";

export const seedUsers = async () => {
  try {
    let user = await User.findOne({});

    if (!user) {
      const users = config.get<[]>("users");
      const hashUsers = users.map(async (user: IUser) => ({
        ...user,
        password: await hashPassword(user.password),
      }));

      const hashedUsers = await Promise.all(hashUsers);

      await User.insertMany(hashedUsers);

      console.log("User seeding completed successfully.", hashedUsers);
    } else {
      console.log("Users are already exists");
    }
  } catch (error) {
    console.error("Error during user seeding:", error);
  }
};
