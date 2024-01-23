import { Document, Schema } from "mongoose";

export interface IPostcard extends Document {
  recipient: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  message: string;
  backgroundImage: string;
  userId: Schema.Types.ObjectId;
  createdAt: Number;
  previewLink: string;
  previewLinkId: string;
  openedCount: number;
  expiresAt: Number;
}
