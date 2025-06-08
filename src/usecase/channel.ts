import { NextFunction, Response } from 'express';

import { IChannel } from '@domain/channel_model';
import ProtectedRequest from '@domain/protected_request_model';
import ResponseModel from '@domain/response_model';

import asyncCatch from '@utils/async_catch';
import ErrorParser from '@utils/error_parser';

import ChannelRepoImpl from '@repository/channel/channel_repo_impl';

const channelRepo = new ChannelRepoImpl();

/**
 * @desc Find all channel
 * @route GET /api/v1/channel
 * @acces Private
 */
export const getChannels = asyncCatch(
  async (_req: ProtectedRequest, res: Response, _next: NextFunction) => {
    const channels = await channelRepo.find();

    res
      .status(200)
      .json(new ResponseModel<IChannel[]>(channels, '0000', 'Success'));
  },
);

/**
 * @desc Find channel by id
 * @route GET /api/v1/channel/:id
 * @acces Private
 */
export const getChannelById = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const channel = await channelRepo.findOne({ id });

    if (!channel) {
      return next(
        new ErrorParser(`No channel with the id of ${req.params.id}`, 404),
      );
    }

    res
      .status(200)
      .json(new ResponseModel<IChannel | null>(channel, '0000', 'Success'));
  },
);

/**
 * @desc Create new channel
 * @route POST /api/v1/channel
 * @acces Private
 */
export const createChannel = asyncCatch(
  async (req: ProtectedRequest, res: Response, _next: NextFunction) => {
    await channelRepo.create(req.body);

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Update channel by id
 * @route PUT /api/v1/channel
 * @acces Private
 */
export const updateChannel = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const channel = await channelRepo.update(req.body);

    if (!channel) {
      return next(
        new ErrorParser(`No channel with the id of ${req.body.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Delete channel by id
 * @route DELETE /api/v1/channel/:id
 * @acces Private
 */
export const deleteChannel = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const channel = await channelRepo.delete(req.params.id);

    if (!channel) {
      return next(
        new ErrorParser(`No channel with the id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);
