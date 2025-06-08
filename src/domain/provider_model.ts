import db from '@infrastructure/mongoose';

const Schema = db.Schema;

export interface IProviderCredential {
  apiKey: string;
  username: string;
  password: string;
  token: string;
  secret: string;
}

export interface IProvider {
  id: string;
  name: string;
  apiUrl: string;
  credentials: IProviderCredential;
  status: string;
  description?: string;
  meta?: Record<string, unknown>;
}

const ProviderSchema = new Schema<IProvider>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Please add a name'],
    },
    apiUrl: {
      type: String,
      required: [true, 'Please add a API URL'],
    },
    credentials: {
      apiKey: { type: String },
      username: { type: String },
      password: { type: String },
      token: { type: String },
      secret: { type: String },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    description: { type: String },
    meta: { type: Schema.Types.Mixed },
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

export const ProviderModel = db.model<IProvider>('Provider', ProviderSchema);
