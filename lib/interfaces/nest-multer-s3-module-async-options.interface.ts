import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { NestMulterS3Options } from './nest-multer-s3-options.interface';
import { NestMulterS3OptionsFactory } from './nest-multer-s3-options-factory.interface';

export interface NestMulterS3AsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<NestMulterS3OptionsFactory>;
  useClass?: Type<NestMulterS3OptionsFactory>;
  useFactory?: (...args: any[]) => Promise<NestMulterS3Options> | NestMulterS3Options;
}
