import { Request } from 'express';

import { IUser } from '@domain/user_model';

interface ProtectedRequest extends Request {
  user?: IUser | null;
  cookies: Record<string, never>;
  signedCookies: Record<string, never>;
}

export default ProtectedRequest;
