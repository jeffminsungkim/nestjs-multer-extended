import { NestMulterS3Options } from './nest-multer-s3-options.interface';

export interface NestMulterS3OptionsFactory {
  createNestMulterS3Options(): Promise<NestMulterS3Options> | NestMulterS3Options;
}
