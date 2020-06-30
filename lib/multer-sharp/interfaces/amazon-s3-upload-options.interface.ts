import { S3 } from 'aws-sdk';

export interface AmazonS3UploadOptions extends Partial<S3.Types.PutObjectRequest> {
  s3: S3;
  Key?: any;
  dynamicPath?: string | string[];
  randomFilename?: boolean;
}
