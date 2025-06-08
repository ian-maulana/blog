import { Router } from 'express';

import {
  getTransactionById,
  getTransactions,
  inquiryPlnPrepaid,
} from '@usecase/transaction';

import protect from '@utils/protect';

const transaction = Router({ mergeParams: true });

transaction.use(protect);
transaction.route('/').get(getTransactions);
transaction.route('/pln-prepaid/inquiry').post(inquiryPlnPrepaid);
transaction.route('/:id').get(getTransactionById);

export default transaction;
