import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '@usecase/product';

import protect from '@utils/protect';

const product = Router({ mergeParams: true });

product.use(protect);
product.route('/').get(getProducts).post(createProduct).put(updateProduct);
product.route('/:id').get(getProductById).delete(deleteProduct);

export default product;
