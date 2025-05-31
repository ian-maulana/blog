import { Router } from 'express';

import { createPassword, forgotPassword } from '@usecase/onboard';

const onboard = Router();

onboard.route('/forgot').post(forgotPassword);
onboard.route('/password/:token').post(createPassword);

export default onboard;
