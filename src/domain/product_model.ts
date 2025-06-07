import db from '@infrastructure/mongoose';

import { ChannelModel, IChannel } from './channel_model';

const Schema = db.Schema;

export interface IProduct {
  name: string;
  category: string;
  nominal: number;
  description: string;
  sku: string;
  status: string;
  markup: number;
  channels: IChannel;
}

const schema = new Schema<IProduct>(
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
    markup: {
      type: Number,
      default: 0,
    },
    channels: [ChannelModel],
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

export const ProductModel = db.model<IProduct>('Product', schema);
