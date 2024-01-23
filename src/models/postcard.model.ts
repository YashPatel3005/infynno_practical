import mongoose, { Schema } from "mongoose";

import { IPostcard } from "../interfaces/PostCardInterface";

import { setCurrentTimestamp } from "../helpers/dateFunction";

const postcardSchema = new Schema<IPostcard>({
  recipient: { type: String, required: true },
  street1: { type: String, required: true },
  street2: { type: String, default: null },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  message: { type: String, required: true },
  backgroundImage: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Number, default: setCurrentTimestamp },
  previewLink: { type: String, unique: true },
  previewLinkId: { type: String, unique: true },
  openedCount: { type: Number, default: 0 },
  expiresAt: {
    type: Number,
    default: null,
  },
});

postcardSchema.index({ createdAt: -1 });
postcardSchema.index({ previewLink: 1 }, { unique: true });

const Postcard = mongoose.model<IPostcard>("Postcard", postcardSchema);

export default Postcard;
