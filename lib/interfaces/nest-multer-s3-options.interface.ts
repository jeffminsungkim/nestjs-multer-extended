import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface NestMulterS3Options extends MulterOptions {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
  readonly bucket: string;
  readonly basePath: string;
  readonly acl?: string;
  readonly fileSize?: number | string;
}
