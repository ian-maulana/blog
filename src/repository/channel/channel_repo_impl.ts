import { ChannelModel, IChannel } from '@domain/channel_model';

import { transformObjectId } from '@utils/mongo_helper';

import ChannelRepo from './channel_repo';

class ChannelRepoImpl implements ChannelRepo {
  async findOne(channel: Partial<IChannel>): Promise<IChannel | null> {
    const doc = await ChannelModel.findOne(transformObjectId(channel))
      .populate({ path: 'provider', select: '-meta -credentials -apiUrl' })
      .exec();
    return doc;
  }

  async update(channel: IChannel): Promise<IChannel | null> {
    const { id } = channel;
    const doc = await ChannelModel.findOne(transformObjectId({ id })).exec();

    if (doc) {
      doc.provider = channel.provider;
      doc.productCode = channel.productCode;
      doc.price = channel.price;
      doc.status = channel.status;
      doc.markup = channel.markup;
      doc.priority = channel.priority;
      doc.meta = channel.meta;

      await doc.save();
    }

    return doc;
  }

  async delete(id: string): Promise<IChannel | null> {
    const doc = await ChannelModel.findByIdAndDelete(id).lean();
    return doc;
  }

  async create(channel: IChannel) {
    const doc = new ChannelModel({
      provider: channel.provider,
      productCode: channel.productCode,
      price: channel.price,
      status: channel.status,
      markup: channel.markup,
      priority: channel.priority,
      meta: channel.meta,
    });

    const result = await doc.save();
    return result;
  }

  async find(): Promise<IChannel[]> {
    const docs = await ChannelModel.find()
      .populate({ path: 'provider', select: '-meta -credentials -apiUrl' })
      .exec();
    return docs;
  }
}

export default ChannelRepoImpl;
