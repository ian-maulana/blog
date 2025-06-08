import { Types } from 'mongoose';

import db from '@infrastructure/mongoose';

import { ChannelSchema } from '@domain/channel_model';
import { IProvider } from '@domain/provider_model';

const Schema = db.Schema;

export interface ITransaction {
  id: string;
  sku: string;
  customerId: string;
  status: string;
  price: number;
  provider: Types.ObjectId | IProvider;
  channel: Record<string, unknown>;
  reffdata: Record<string, unknown>;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    sku: {
      type: String,
      required: [true, 'Please add a sku'],
    },
    customerId: {
      type: String,
      required: [true, 'Please add a customer number'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    price: {
      type: Number,
      default: 0,
    },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    channel: ChannelSchema,
    reffdata: {
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

export const TransactionModel = db.model<ITransaction>(
  'Transaction',
  TransactionSchema,
);
