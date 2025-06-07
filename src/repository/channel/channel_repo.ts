import { IChannel } from '@domain/channel_model';

interface ChannelRepo {
  find(): Promise<IChannel[]>;
  findOne(provider: Partial<IChannel>): Promise<IChannel | null>;
  update(provider: IChannel): Promise<IChannel | null>;
  delete(id: string): Promise<IChannel | null>;
  create(provider: IChannel): Promise<IChannel | null>;
}

export default ChannelRepo;
