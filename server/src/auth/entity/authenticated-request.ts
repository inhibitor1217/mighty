import type { Request } from 'express';
import { User } from '../../user/model/user.model';

export interface AuthenticatedRequest extends Request {
  user: User;
}
