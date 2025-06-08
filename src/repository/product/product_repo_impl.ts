import { IProduct, ProductModel } from '@domain/product_model';

import { transformObjectId } from '@utils/mongo_helper';

import ProductRepo from './product_repo';

class ProductRepoImpl implements ProductRepo {
  async findOne(product: Partial<IProduct>): Promise<IProduct | null> {
    const doc = await ProductModel.findOne(transformObjectId(product))
      .populate({
        path: 'channels',
        select: '-meta -provider',
        populate: { path: 'provider', select: '-credentials -apiUrl' },
      })
      .exec();
    return doc;
  }

  async update(product: IProduct): Promise<IProduct | null> {
    const { id } = product;
    const doc = await ProductModel.findOne(transformObjectId({ id })).exec();

    if (doc) {
      doc.sku = product.sku;
      doc.name = product.name;
      doc.category = product.category;
      doc.status = product.status;
      doc.description = product.description;
      doc.defaultMarkup = product.defaultMarkup;
      doc.channels = product.channels;

      await doc.save();
    }

    return doc;
  }

  async delete(id: string): Promise<IProduct | null> {
    const doc = await ProductModel.findByIdAndDelete(id).lean();
    return doc;
  }

  async create(product: IProduct) {
    const doc = new ProductModel({
      sku: product.sku,
      name: product.name,
      category: product.category,
      status: product.status,
      description: product.description,
      defaultMarkup: product.defaultMarkup,
      channels: product.channels,
    });

    const result = await doc.save();
    return result;
  }

  async find(): Promise<IProduct[]> {
    const docs = await ProductModel.find()
      .populate({
        path: 'channels',
        select: '-meta -provider',
        populate: { path: 'provider', select: '-credentials -apiUrl' },
      })
      .exec();
    return docs;
  }
}

export default ProductRepoImpl;
