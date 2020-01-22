import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface NestMulterS3Options extends MulterOptions {
  //
  // This interface describes the options you want to pass to
  // NestMulterS3Module.
  //

  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly region: string;
  readonly bucket: string;
  readonly appName: string;
  readonly acl?: string;
  readonly fileSize?: number;
}
