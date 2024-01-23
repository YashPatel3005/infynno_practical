import mongoose, { Document, Schema } from "mongoose";

interface IPostcard extends Document {
  recipient: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  message: string;
  backgroundImage: string;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  previewLink: string;
  previewLinkId: string;
  openedCount: number;
  expiresAt: Date;
}

const postcardSchema = new Schema<IPostcard>({
  recipient: { type: String, required: true },
  street1: { type: String, required: true },
  street2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  message: { type: String, required: true },
  backgroundImage: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  previewLink: { type: String, unique: true },
  previewLinkId: { type: String, unique: true },
  openedCount: { type: Number, default: 0 },
  expiresAt: {
    type: Date,
    // default: () => new Date(Date.now() + 60 * 60 * 1000),
  }, // Expires in 1 hour
});

postcardSchema.index({ createdAt: -1 });
postcardSchema.index({ previewLink: 1 }, { unique: true });

const Postcard = mongoose.model<IPostcard>("Postcard", postcardSchema);

export { Postcard, IPostcard };
