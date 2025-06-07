import { Router } from 'express';

import {
  createPassword,
  forgotPassword,
  getMe,
  login,
  logout,
} from '@usecase/onboard';

import protect from '@utils/protect';

const onboard = Router();

onboard.route('/forgot').post(forgotPassword);
onboard.route('/password/:token').post(createPassword);
onboard.route('/login').post(login);
onboard.route('/logout').post(logout);
onboard.route('/me').get(protect, getMe);

export default onboard;
