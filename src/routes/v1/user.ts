import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '@usecase/user';

import protect from '@utils/protect';

const user = Router({ mergeParams: true });

user.use(protect);
user.route('/').get(getUsers).post(createUser).put(updateUser);
user.route('/:id').get(getUserById).delete(deleteUser);

export default user;
