import AWS from 'aws-sdk';
import s3Storage from 'multer-sharp-s3';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { NEST_MULTER_S3_OPTIONS } from './constants';
import { NestMulterS3Options } from './interfaces';

// tslint:disable-next-line:no-empty-interface
interface INestMulterS3Service extends MulterOptionsFactory {
  // Customize this as needed to describe the NestS3MulterService
}

@Injectable()
export class NestMulterS3Service implements INestMulterS3Service {
  private readonly S3: AWS.S3;
  private readonly logger: Logger;
  private readonly DEFAULT_ACL: string;

  constructor(@Inject(NEST_MULTER_S3_OPTIONS) private nestMulterS3Options: NestMulterS3Options) {
    AWS.config.update({
      accessKeyId: nestMulterS3Options.accessKeyId,
      secretAccessKey: nestMulterS3Options.secretAccessKey,
      region: nestMulterS3Options.region || 'us-west-2',
    });

    this.S3 = new AWS.S3();
    this.DEFAULT_ACL = 'private';

    this.logger = new Logger('NestMulterS3Service Options');
    this.logger.log(JSON.stringify(nestMulterS3Options));
  }

  createMulterOptions(): MulterModuleOptions | Promise<MulterModuleOptions> {
    const storage = s3Storage({
      Key: (req, file, cb) => {
        const basePath = `${this.nestMulterS3Options.basePath}`;

        cb(null, basePath);
      },
      s3: this.S3,
      Bucket: this.nestMulterS3Options.bucket,
      ACL: this.nestMulterS3Options.acl || this.DEFAULT_ACL,
      resize: [],
      multiple: true,
      ignoreAspectRatio: true,
    });

    return {
      storage,
      limits: { fileSize: +this.nestMulterS3Options.fileSize || 3145728 },
    };
  }
}
