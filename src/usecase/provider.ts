import { NextFunction, Response } from 'express';

import { IProvider } from '@domain/provider_model';
import ProtectedRequest from '@domain/request_model';
import ResponseModel from '@domain/response_model';

import asyncCatch from '@utils/async_catch';
import ErrorParser from '@utils/error_parser';

import ProviderRepoImpl from '@repository/provider/provider_repo_impl';

const providerRepo = new ProviderRepoImpl();

/**
 * @desc Find all provider
 * @route GET /api/v1/provider
 * @acces Private
 */
export const getProviders = asyncCatch(
  async (_req: ProtectedRequest, res: Response, _next: NextFunction) => {
    const providers = await providerRepo.find();

    res
      .status(200)
      .json(new ResponseModel<IProvider[]>(providers, '0000', 'Success'));
  },
);

/**
 * @desc Find provider by id
 * @route GET /api/v1/provider/:id
 * @acces Private
 */
export const getProviderById = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const provider = await providerRepo.findOne({ id });

    if (!provider) {
      return next(
        new ErrorParser(`No provider with the id of ${req.params.id}`, 404),
      );
    }

    res
      .status(200)
      .json(new ResponseModel<IProvider | null>(provider, '0000', 'Success'));
  },
);

/**
 * @desc Create new provider
 * @route POST /api/v1/provider
 * @acces Private
 */
export const createProvider = asyncCatch(
  async (req: ProtectedRequest, res: Response, _next: NextFunction) => {
    await providerRepo.create(req.body);

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Update provider by id
 * @route PUT /api/v1/provider
 * @acces Private
 */
export const updateProvider = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const provider = await providerRepo.update(req.body);

    if (!provider) {
      return next(
        new ErrorParser(`No provider with the id of ${req.body.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Delete provider by id
 * @route DELETE /api/v1/provider/:id
 * @acces Private
 */
export const deleteProvider = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const provider = await providerRepo.delete(req.params.id);

    if (!provider) {
      return next(
        new ErrorParser(`No provider with the id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);
