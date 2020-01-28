export interface MulterExtendedS3Options {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
  readonly bucket: string;
  readonly basePath: string;
  readonly acl?: string;
  readonly fileSize?: number | string;
}
