import { Types } from 'mongoose';

import db from '@infrastructure/mongoose';

import { IProvider } from '@domain/provider_model';

const Schema = db.Schema;

export interface IChannel {
  id: string;
  provider: Types.ObjectId | IProvider;
  productCode: string;
  price: number;
  status: string;
  markup?: number;
  priority?: number;
  meta?: Record<string, unknown>;
}

const ChannelSchema = new Schema<IChannel>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: [true, 'Please add a provider'],
    },
    productCode: {
      type: String,
      required: [true, 'Please add a product code'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
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
    priority: {
      type: Number,
      default: 1,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
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

export const ChannelModel = db.model<IChannel>('Channel', ChannelSchema);
