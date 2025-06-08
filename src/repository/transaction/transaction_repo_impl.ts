import { createHash } from 'node:crypto';

import { iakPrepaidService } from '@infrastructure/iak_prepaid_service';

import { IChannel } from '@domain/channel_model';
import { ICustomerPln } from '@domain/customer_pln_model';
import { ProviderModel } from '@domain/provider_model';
import { ITransaction, TransactionModel } from '@domain/transaction_model';

import convertCase from '@utils/convert_case';
import { transformObjectId } from '@utils/mongo_helper';

import TransactionRepo from '@repository/transaction/transaction_repo';

class TransactionRepoImpl implements TransactionRepo {
  async find(): Promise<ITransaction[]> {
    const docs = await TransactionModel.find()
      .populate({ path: 'channel', select: '-meta -provider' })
      .exec();
    return docs;
  }

  async findOne(
    transaction: Partial<ITransaction>,
  ): Promise<ITransaction | null> {
    const doc = await TransactionModel.findOne(transformObjectId(transaction))
      .populate({
        path: 'channel',
        select: '-meta -provider',
      })
      .exec();
    return doc;
  }

  async inquiryPlnPrepaid(
    channel: IChannel,
    customerId: string,
  ): Promise<ICustomerPln | null> {
    const channelCode = convertCase(channel.provider.name, 'snake');

    if (channelCode === 'iak_prepaid') {
      let payload = {};
      const provider = await ProviderModel.findById(channel.provider.id).lean();

      if (provider) {
        const username = provider?.credentials.username ?? '';
        const apikey = provider?.credentials.apiKey ?? '';

        payload = {
          customer_id: customerId,
          username: provider?.credentials.username,
          sign: createHash('md5')
            .update(username + apikey + customerId)
            .digest('hex')
            .toString(),
        };

        const response = await iakPrepaidService(provider, payload);

        if (response.data.status === '1') {
          return response.data;
        }
      }
    }

    return null;
  }
}

export default TransactionRepoImpl;
