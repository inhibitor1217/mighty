import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';

export const createRepositoryMock = <Entity extends EntityClassOrSchema>(
  entity: Entity
): Provider<Repository<Entity>> => ({
  provide: getRepositoryToken(entity),
  useClass: Repository,
});
