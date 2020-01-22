// tslint:disable: variable-name
import AWS from 'aws-sdk';
import s3Storage from 'multer-sharp-s3';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { NEST_MULTER_S3_OPTIONS } from './constants';
import { NestMulterS3Options } from './interfaces';

interface INestMulterS3Service extends MulterOptionsFactory {
  // Customize this as needed to describe the NestS3MulterService
}

@Injectable()
export class NestMulterS3Service implements INestMulterS3Service {
  private readonly s3: AWS.S3;
  private readonly logger: Logger;
  private readonly acl: string;
  private readonly appName: string;
  private readonly bucket: string;

  constructor(@Inject(NEST_MULTER_S3_OPTIONS) private nestMulterS3Options: NestMulterS3Options) {
    AWS.config.update({
      accessKeyId: nestMulterS3Options.accessKeyId,
      secretAccessKey: nestMulterS3Options.secretAccessKey,
      region: nestMulterS3Options.region,
    });

    this.s3 = new AWS.S3();
    this.bucket = nestMulterS3Options.bucket;
    this.appName = nestMulterS3Options.appName;
    this.acl = nestMulterS3Options.acl;
    this.logger = new Logger('NestMulterS3Service Options');
    this.logger.log(JSON.stringify(nestMulterS3Options));
  }

  createMulterOptions(): MulterModuleOptions | Promise<MulterModuleOptions> {
    const storage = s3Storage({
      Key: (req, file, cb) => {
        const basePath = `${this.appName}`;

        cb(null, basePath);
      },
      s3: this.s3,
      Bucket: this.bucket,
      ACL: this.acl || 'private',
      resize: [],
      multiple: true,
      ignoreAspectRatio: true,
    });

    return {
      storage,
      // fileFilter: FileUploadFactory().filterImageFileExtension,
      limits: { fileSize: this.nestMulterS3Options.fileSize || 3145728 },
    };
  }
}
