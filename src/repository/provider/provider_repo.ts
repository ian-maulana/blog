import { IProvider } from '@domain/provider_model';

interface ProviderRepo {
  find(): Promise<IProvider[]>;
  findOne(provider: Partial<IProvider>): Promise<IProvider | null>;
  update(provider: IProvider): Promise<IProvider | null>;
  delete(id: string): Promise<IProvider | null>;
  create(provider: IProvider): Promise<IProvider | null>;
}

export default ProviderRepo;
