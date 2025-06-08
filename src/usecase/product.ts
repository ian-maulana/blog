import { NextFunction, Response } from 'express';

import { IProduct } from '@domain/product_model';
import ProtectedRequest from '@domain/protected_request_model';
import ResponseModel from '@domain/response_model';

import asyncCatch from '@utils/async_catch';
import ErrorParser from '@utils/error_parser';

import ProductRepoImpl from '@repository/product/product_repo_impl';

const productRepo = new ProductRepoImpl();

/**
 * @desc Find all product
 * @route GET /api/v1/product
 * @acces Private
 */
export const getProducts = asyncCatch(
  async (_req: ProtectedRequest, res: Response, _next: NextFunction) => {
    const products = await productRepo.find();

    res
      .status(200)
      .json(new ResponseModel<IProduct[]>(products, '0000', 'Success'));
  },
);

/**
 * @desc Find product by id
 * @route GET /api/v1/product/:id
 * @acces Private
 */
export const getProductById = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const product = await productRepo.findOne({ id });

    if (!product) {
      return next(
        new ErrorParser(`No product with the id of ${req.params.id}`, 404),
      );
    }

    res
      .status(200)
      .json(new ResponseModel<IProduct | null>(product, '0000', 'Success'));
  },
);

/**
 * @desc Create new product
 * @route POST /api/v1/product
 * @acces Private
 */
export const createProduct = asyncCatch(
  async (req: ProtectedRequest, res: Response, _next: NextFunction) => {
    await productRepo.create(req.body);

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Update product by id
 * @route PUT /api/v1/product
 * @acces Private
 */
export const updateProduct = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const product = await productRepo.update(req.body);

    if (!product) {
      return next(
        new ErrorParser(`No product with the id of ${req.body.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);

/**
 * @desc Delete product by id
 * @route DELETE /api/v1/product/:id
 * @acces Private
 */
export const deleteProduct = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const product = await productRepo.delete(req.params.id);

    if (!product) {
      return next(
        new ErrorParser(`No product with the id of ${req.params.id}`, 404),
      );
    }

    res.status(200).json(new ResponseModel(null, '0000', 'Success'));
  },
);
