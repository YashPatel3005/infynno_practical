import { Request, Response } from "express";

import { SortOrder } from "mongoose";

import { v4 as uuidv4 } from "uuid";

import constants from "../../config/constants";

import Postcard from "../models/postcard.model";

import { IRequest } from "../middleware/authentication";

import { IPostcard } from "../interfaces/PostCardInterface";

import {
  setCurrentTimestamp,
  addTimeToCurrentTimestamp,
} from "../helpers/dateFunction";

/**
 * Create a new Postcard
 *
 * @body recipient, street1, street2, city, state, zipCode, message
 *
 * @returns { savedPostcard }
 */
const createPostCardHandler = async (req: IRequest, res: Response) => {
  const { recipient, street1, street2, city, state, zipCode, message } =
    req.body;

  try {
    if (!req.file) {
      return res.status(400).send({
        status: constants.STATUS_CODE.FAIL,
        message: "No file uploaded",
        error: false,
        data: {},
      });
    }

    const userId: { _id?: string } = req.user;

    const previewLinkId: string = uuidv4();

    const expiresAt: Number = addTimeToCurrentTimestamp(1, "hour");

    const postcard: IPostcard = new Postcard({
      recipient,
      street1,
      street2,
      city,
      state,
      zipCode,
      message,
      backgroundImage: req.file.path,
      userId: userId._id.toString(),
      previewLink: `http://localhost:3000/v1/api/postcard/previewLink/${previewLinkId}`,
      previewLinkId,
      expiresAt,
    });

    const savedPostcard = await postcard.save();

    return res.status(201).send({
      status: constants.STATUS_CODE.SUCCESS,
      message: "Postcard has been created successfully",
      error: false,
      data: savedPostcard,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Get lists of Postcards
 *
 * @query q, page, limit
 *
 * @returns { postcards, page, limit, total }
 */
const postCardListHandler = async (req: IRequest, res: Response) => {
  try {
    const userId: { _id?: string } = req.user;

    const search = req.query.q ? req.query.q : "";

    const sortBy = req.query.sortBy as string;

    let field: string, value: SortOrder;
    if (sortBy) {
      const parts: string[] = sortBy.split(":");
      field = parts[0];
      parts[1] === "desc" ? (value = -1) : (value = 1);
    } else {
      (field = "createdAt"), (value = 1);
    }

    const pageOptions = {
      page: parseInt(req.query.page as string) || constants.PAGE,
      limit: parseInt(req.query.limit as string) || constants.LIMIT,
    };

    const query = search
      ? {
          $or: [{ recipient: new RegExp(search as string, "i") }],
        }
      : {};

    let total = await Postcard.countDocuments({ userId, ...query });

    let postcards = await Postcard.find({ userId, ...query })
      .sort({ [field]: value })
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .limit(pageOptions.limit)
      .collation({ locale: "en" });

    let page = pageOptions.page;
    let limit = pageOptions.limit;

    return res.status(200).send({
      status: constants.STATUS_CODE.SUCCESS,
      message: "Postcard has been successfully retrieved",
      error: false,
      data: { postcards, page, limit, total },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

/**
 * Preview Postcard
 *
 * @params previewLinkId
 *
 * @returns { postcard }
 */
const previewPostcardHandler = async (req: Request, res: Response) => {
  try {
    const { previewLinkId } = req.params;

    const postcard: IPostcard = await Postcard.findOne({ previewLinkId });

    if (!postcard) {
      return res.status(404).send({
        status: constants.STATUS_CODE.NOT_FOUND,
        message: "Postcard not found",
        error: false,
        data: {},
      });
    }

    // Check if the link has expired
    const currentTimestamp: Number = setCurrentTimestamp();
    if (postcard.expiresAt < currentTimestamp) {
      return res.status(403).send({
        status: constants.STATUS_CODE.FAIL,
        message: "Postcard link has expired",
        error: false,
        data: {},
      });
    }

    postcard.openedCount += 1;
    await postcard.save();

    return res.status(200).send({
      status: constants.STATUS_CODE.SUCCESS,
      message: "Postcard preview link successfully opened and retrieved data",
      error: false,
      data: postcard,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: constants.STATUS_CODE.FAIL,
      message: "Something went wrong",
      error: true,
      data: {},
    });
  }
};

export { createPostCardHandler, postCardListHandler, previewPostcardHandler };
