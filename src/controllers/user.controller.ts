import { Request, Response } from "express";
import User from "../models/user.model";
import constants from "../../config/constants";
import { comparePasswords } from "../utils/passwordUtils";

const userLoginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        status: constants.STATUS_CODE.NOT_FOUND,
        message: "User not found",
        error: false,
        data: {},
      });
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Invalid password",
        error: false,
        data: {},
      });
    }

    const token = await user.generateAuthToken();
    console.log("token", token);

    //Store token to db
    user.tokens.push({
      token: token,
    });

    await user.save();

    res.status(200).send({
      status: constants.STATUS_CODE.SUCCESS,
      message: "Login success",
      error: false,
      data: { user, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

export { userLoginHandler };
