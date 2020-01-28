import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { MulterExtendedS3Options } from './multer-extended-s3-options.interface';
import { MulterExtendedS3OptionsFactory } from './multer-extended-s3-options-factory.interface';

export interface MulterExtendedS3AsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MulterExtendedS3OptionsFactory>;
  useClass?: Type<MulterExtendedS3OptionsFactory>;
  useFactory?: (...args: any[]) => Promise<MulterExtendedS3Options> | MulterExtendedS3Options;
}
