import { Types } from 'mongoose';

import db from '@infrastructure/mongoose';

import { IChannel } from './channel_model';

const Schema = db.Schema;

export interface IProduct {
  id: string;
  name: string;
  category: string;
  nominal: number;
  description: string;
  sku: string;
  status: string;
  defaultMarkup: number;
  channels: Types.ObjectId[] | IChannel[];
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    nominal: {
      type: Number,
    },
    description: {
      type: String,
    },
    sku: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    defaultMarkup: {
      type: Number,
      default: 0,
    },
    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, res) => {
        delete res._id;
      },
    },
  },
);

export const ProductModel = db.model<IProduct>('Product', ProductSchema);
