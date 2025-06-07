import { IProvider, ProviderModel } from '@domain/provider_model';

import { transformObjectId } from '@utils/mongo_helper';

import ProviderRepo from './provider_repo';

class ProviderRepoImpl implements ProviderRepo {
  async findOne(provider: Partial<IProvider>): Promise<IProvider | null> {
    const doc = await ProviderModel.findOne(transformObjectId(provider)).exec();
    return doc;
  }

  async update(provider: IProvider): Promise<IProvider | null> {
    const { id } = provider;
    const doc = await ProviderModel.findOne(transformObjectId({ id })).exec();

    if (doc) {
      doc.name = provider.name;
      doc.status = provider.status;
      doc.credentials = provider.credentials;
      doc.meta = provider.meta;

      await doc.save();
    }

    return doc;
  }

  async delete(id: string): Promise<IProvider | null> {
    const doc = await ProviderModel.findByIdAndDelete(id).lean();
    return doc;
  }

  async create(provider: IProvider) {
    const doc = new ProviderModel({
      name: provider.name,
      apiUrl: provider.apiUrl,
      credentials: provider.credentials,
      meta: provider.meta,
    });

    const result = await doc.save();
    return result;
  }

  async find(): Promise<IProvider[]> {
    const docs = await ProviderModel.find().exec();
    return docs;
  }
}

export default ProviderRepoImpl;
