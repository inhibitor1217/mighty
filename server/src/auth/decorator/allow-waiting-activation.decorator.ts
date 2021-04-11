import { SetMetadata } from '@nestjs/common';
import { MetadataKeys } from '../../utils/metadata-keys';

export const AllowWaitingActivation = () =>
  SetMetadata(MetadataKeys.AllowUserWaitingForActivation, true);
