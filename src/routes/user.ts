import { Router } from 'express';
import { getUsers } from '../usecase/user';

const user = Router({ mergeParams: true });

user.route('/').get(getUsers);

export default user;
