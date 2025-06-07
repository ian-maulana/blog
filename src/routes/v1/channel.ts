import { Router } from 'express';

import {
  createChannel,
  deleteChannel,
  getChannelById,
  getChannels,
  updateChannel,
} from '@usecase/channel';

import protect from '@utils/protect';

const channel = Router({ mergeParams: true });

channel.use(protect);
channel.route('/').get(getChannels).post(createChannel).put(updateChannel);
channel.route('/:id').get(getChannelById).delete(deleteChannel);

export default channel;
