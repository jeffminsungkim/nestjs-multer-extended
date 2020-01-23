import { NestMulterS3Options } from './interfaces';
import { NEST_MULTER_S3_OPTIONS, NEST_MULTER_S3_MODULE_ID } from './constants';
import { randomStringGenerator } from './utils/random-string-generator.util';

export function createNestS3MulterProviders(options: NestMulterS3Options) {
  return [
    {
      provide: NEST_MULTER_S3_OPTIONS,
      useValue: options,
    },
    {
      provide: NEST_MULTER_S3_MODULE_ID,
      useValue: randomStringGenerator(),
    },
  ];
}
