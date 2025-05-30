import db from '../infastructure/mongoose';
import bcrypt from 'bcryptjs';

const Schema = db.Schema;

export interface IUser {
  id: string;
  email: string;
  password?: string;
  passwordToken?: string;
  passwordTokenExpired?: Date;
  name: string;
  status: string;
  role: string;
}

const schema = new Schema<IUser>(
  {
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
    passwordToken: String,
    passwordTokenExpired: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'inactive',
    },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'admin',
    },
  },
  { timestamps: true },
);

schema.pre('save', async function (next) {
  if (this.password) {
    if (!this.isModified('password')) {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export const UserModel = db.model<IUser>('User', schema);
