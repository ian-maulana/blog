import db from '../infastructure/mongoose';

const Schema = db.Schema;

export interface IUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  status: boolean;
  role: string;
}

const schema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  status: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
});

export const UserModel = db.model<IUser>('Users', schema);
