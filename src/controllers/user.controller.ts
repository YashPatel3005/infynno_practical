import { Request, Response } from "express";

import User from "../models/user.model";

import constants from "../../config/constants";

import { comparePasswords } from "../utils/passwordUtils";

/**
 * Login a user
 *
 * @body email, password
 *
 * @returns {user , token}
 */
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

    const isPasswordValid: boolean = await comparePasswords(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(404).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Invalid password",
        error: false,
        data: {},
      });
    }

    const token: string = await user.generateAuthToken();

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
