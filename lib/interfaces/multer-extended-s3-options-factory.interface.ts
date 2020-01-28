import { MulterExtendedS3Options } from './multer-extended-s3-options.interface';

export interface MulterExtendedS3OptionsFactory {
  createMulterExtendedS3Options(): Promise<MulterExtendedS3Options> | MulterExtendedS3Options;
}
