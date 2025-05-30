import { Router } from 'express';
import { createPassword } from '../../usecase/onboard';

const onboard = Router();

onboard.route('/password/:token').post(createPassword);

export default onboard;
