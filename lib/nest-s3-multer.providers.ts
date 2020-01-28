import { MulterExtendedS3Options } from './interfaces';
import { MULTER_EXTENDED_S3_OPTIONS, MULTER_EXTENDED_S3_MODULE_ID } from './constants';
import { randomStringGenerator } from './utils/random-string-generator.util';

export function createNestS3MulterProviders(options: MulterExtendedS3Options) {
  return [
    {
      provide: MULTER_EXTENDED_S3_OPTIONS,
      useValue: options,
    },
    {
      provide: MULTER_EXTENDED_S3_MODULE_ID,
      useValue: randomStringGenerator(),
    },
  ];
}
