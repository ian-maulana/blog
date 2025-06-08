import { IChannel } from '@domain/channel_model';
import { ICustomerPln } from '@domain/customer_pln_model';
import { ITransaction } from '@domain/transaction_model';

interface TransactionRepo {
  find(): Promise<ITransaction[]>;
  findOne(transaction: Partial<ITransaction>): Promise<ITransaction | null>;
  inquiryPlnPrepaid(
    channel: IChannel,
    customerId: string,
  ): Promise<ICustomerPln | null>;
}

export default TransactionRepo;
