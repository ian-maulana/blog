import axios from 'axios';

import { IProvider } from '@domain/provider_model';

export const iakPrepaidService = async (
  provider: IProvider,
  payload: Record<string, unknown>,
) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const api = `${provider.apiUrl}/api/inquiry-pln`;
  const response = await axios.post(api, payload, { headers });
  return response.data;
};
