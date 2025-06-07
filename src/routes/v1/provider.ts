import { Router } from 'express';

import {
  createProvider,
  deleteProvider,
  getProviderById,
  getProviders,
  updateProvider,
} from '@usecase/provider';

import protect from '@utils/protect';

const channel = Router({ mergeParams: true });

channel.use(protect);
channel.route('/').get(getProviders).post(createProvider).put(updateProvider);
channel.route('/:id').get(getProviderById).delete(deleteProvider);

export default channel;
