import { LoggerService } from '@nestjs/common';

export interface MulterExtendedS3Options {
  /**
   * AWS Access Key ID
   */
  readonly accessKeyId: string;
  /**
   * AWS Secret Access Key
   */
  readonly secretAccessKey: string;
  /**
   * Default region name
   * default: us-west-2
   */
  readonly region: string;
  /**
   * The name of Amazon S3 bucket
   */
  readonly bucket: string;
  /**
   * The base path where you want to store files in
   */
  readonly basePath: string;
  /**
   * Optional parameter for Access control level for the file
   * default: public-read
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
   */
  readonly acl?: string;
  /**
   * Optional parameter for the file size
   * default: 3MB
   */
  readonly fileSize?: number | string;
  /**
   * Optional parameter for a custom logger
   * default: NestJS built-in text-based logger
   * @see https://docs.nestjs.com/techniques/logger
   */
  readonly logger?: LoggerService;
}
