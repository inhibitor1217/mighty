import { QueryRunner } from 'typeorm';

export interface RdbQueryRunnerFactory {
  create(): QueryRunner;
}
