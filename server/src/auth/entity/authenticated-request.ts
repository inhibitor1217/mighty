import { User } from '../../user/model/user.model';

export interface AuthenticatedRequest {
  user: User;
}
