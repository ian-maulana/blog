import { IProduct } from '@domain/product_model';

interface ProductRepo {
  find(): Promise<IProduct[]>;
  findOne(product: Partial<IProduct>): Promise<IProduct | null>;
  update(product: IProduct): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
  create(product: IProduct): Promise<IProduct | null>;
}

export default ProductRepo;
