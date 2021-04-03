import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './entity/environment';

@Injectable()
export class EnvConfigService extends ConfigService<Environment> {}
