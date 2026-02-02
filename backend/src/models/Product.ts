import { Schema, model, Document } from "mongoose";

interface IDistancePrice {
  town: string;
  price: number;
}

export interface IProduct extends Document {
  name: string;
  basePrice: number;
  distancePrices: IDistancePrice[];
  createdBy: string;
  imageUrl?: string; // optional image URL
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    basePrice: {
      type: Number,
      required: true
    },
    distancePrices: [
      {
        town: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    imageUrl: {
      type: String // store image URL here
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export default model<IProduct>("Product", productSchema);
