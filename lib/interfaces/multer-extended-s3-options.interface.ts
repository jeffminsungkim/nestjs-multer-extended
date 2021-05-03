import { LoggerService } from '@nestjs/common';
import { APIVersions } from 'aws-sdk/lib/config';
import { ConfigurationOptions } from 'aws-sdk/lib/config-base';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import AWS from 'aws-sdk';

export interface MulterExtendedS3Options {
  /**
   * AWS Access Key ID
   * @deprecated v2 use awsConfig instead
   */
  readonly accessKeyId?: string;
  /**
   * AWS Secret Access Key
   * @deprecated v2 use awsConfig instead
   */
  readonly secretAccessKey?: string;
  /**
   * Default region name
   * default: us-west-2
   * @deprecated v2 use awsConfig instead
   */
  readonly region?: string;
  /**
   * AWS Config
   */
  readonly awsConfig?: ConfigurationOptions &
    ConfigurationServicePlaceholders &
    APIVersions & { [key: string]: any };
  /**
   * S3 Config
   */
  readonly s3Config?: AWS.S3.Types.ClientConfiguration;
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
   * AWS Endpoint
   * @deprecated v2 use s3Config instead
   */
  readonly endpoint?: string;
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
