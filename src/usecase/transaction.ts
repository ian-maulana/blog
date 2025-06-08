import { NextFunction, Response } from 'express';

import { ICustomerPln } from '@domain/customer_pln_model';
import ProtectedRequest from '@domain/protected_request_model';
import ResponseModel from '@domain/response_model';
import { ITransaction } from '@domain/transaction_model';

import asyncCatch from '@utils/async_catch';
import ErrorParser from '@utils/error_parser';

import ProductRepoImpl from '@repository/product/product_repo_impl';
import TransactionRepoImpl from '@repository/transaction/transaction_repo_impl';

const transactionRepo = new TransactionRepoImpl();
const productRepo = new ProductRepoImpl();

/**
 * @desc Find all transaction
 * @route GET /api/v1/transaction
 * @acces Private
 */
export const getTransactions = asyncCatch(
  async (_req: ProtectedRequest, res: Response, _next: NextFunction) => {
    const transactions = await transactionRepo.find();

    res
      .status(200)
      .json(new ResponseModel<ITransaction[]>(transactions, '0000', 'Success'));
  },
);

/**
 * @desc Find transaction by id
 * @route GET /api/v1/transaction/:id
 * @acces Private
 */
export const getTransactionById = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const channel = await transactionRepo.findOne({ id });

    if (!channel) {
      return next(
        new ErrorParser(`No transaction with the id of ${req.params.id}`, 404),
      );
    }

    res
      .status(200)
      .json(new ResponseModel<ITransaction | null>(channel, '0000', 'Success'));
  },
);

/**
 * @desc Inquiry transaction
 * @route GET /api/v1/transaction/pln-prepaid/inquiry
 * @acces Private
 */
export const inquiryPlnPrepaid = asyncCatch(
  async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const { sku, customerId } = req.body;
    const product = await productRepo.findOne({ sku });

    if (!product) {
      return next(new ErrorParser(`No product with the sku of ${sku}`, 404));
    }

    const availableChannels = (product.channels ?? [])
      .filter(ch => ch.status === 'active')
      .sort((a, b) => a.price + (a.markup || 0) - (b.price + (b.markup || 0)));

    if ((availableChannels ?? []).length <= 0) {
      return next(new ErrorParser(`No active channel available`, 400));
    }

    const response = await transactionRepo.inquiryPlnPrepaid(
      availableChannels[0],
      customerId,
    );

    if (response?.status !== '1') {
      return next(new ErrorParser(`Inquiry failed`, 400));
    }

    res
      .status(200)
      .json(
        new ResponseModel<ICustomerPln | null>(response, '0000', 'Success'),
      );
  },
);
