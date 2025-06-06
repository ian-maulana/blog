import { Router } from 'express';

import { createPassword, forgotPassword, login } from '@usecase/onboard';

const onboard = Router();

onboard.route('/forgot').post(forgotPassword);
onboard.route('/password/:token').post(createPassword);
onboard.route('/login').post(login);

export default onboard;
