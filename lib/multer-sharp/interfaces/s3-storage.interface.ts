import { AmazonS3UploadOptions } from './amazon-s3-upload-options.interface';
import { SharpOptions } from './sharp-options.interface';

export type S3StorageOptions = AmazonS3UploadOptions & SharpOptions;

export interface S3Storage {
  storageOpts: S3StorageOptions;
  sharpOpts: SharpOptions;
}
