import AWS from 'aws-sdk';
import s3Storage from 'multer-sharp-s3';
import { Injectable, Inject, Logger, BadRequestException, LoggerService } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { MULTER_EXTENDED_S3_OPTIONS } from './constants';
import { MulterExtendedS3Options } from './interfaces';
import { ImageFileExtensions } from './multer/image-file-extensions.enum';
import { MulterExceptions } from './multer/multer-exceptions.enum';

// tslint:disable-next-line:no-empty-interface
interface MulterS3ConfigService extends MulterOptionsFactory {
  // Customize this as needed to describe the MulterConfigService
}

@Injectable()
export class MulterConfigService implements MulterS3ConfigService {
  static DEFAULT_ACL: string = 'public-read';
  static DEFAULT_REGION: string = 'us-west-2';
  static DEFAULT_MAX_FILESIZE: number = 3145728;
  private readonly S3: AWS.S3;
  private readonly logger: LoggerService;

  constructor(@Inject(MULTER_EXTENDED_S3_OPTIONS) private s3Options: MulterExtendedS3Options) {
    AWS.config.update({
      accessKeyId: s3Options.accessKeyId,
      secretAccessKey: s3Options.secretAccessKey,
      region: s3Options.region || MulterConfigService.DEFAULT_REGION,
    });

    this.S3 = new AWS.S3();
    this.logger = s3Options.logger || new Logger('NestMulterS3Service Options');
    this.logger.log(JSON.stringify(s3Options));
  }

  createMulterOptions(): MulterModuleOptions | Promise<MulterModuleOptions> {
    const storage = s3Storage({
      Key: (req, file, cb) => {
        const basePath = `${this.s3Options.basePath}`;

        cb(null, basePath);
      },
      s3: this.S3,
      Bucket: this.s3Options.bucket,
      ACL: this.s3Options.acl || MulterConfigService.DEFAULT_ACL,
    });

    return {
      storage,
      fileFilter: this.filterImageFileExtension,
      limits: {
        fileSize: +this.s3Options.fileSize || MulterConfigService.DEFAULT_MAX_FILESIZE,
      },
    };
  }

  private filterImageFileExtension(req, file, cb) {
    const { mimetype } = file;
    const extension = mimetype.split('/').pop();
    const mimetypeIsNotImage = (ext: ImageFileExtensions): boolean =>
      !Object.values(ImageFileExtensions).includes(ext);

    if (mimetypeIsNotImage(extension)) {
      req.fileValidationError = MulterExceptions.INVALID_IMAGE_FILE_TYPE;
      return cb(new BadRequestException(MulterExceptions.INVALID_IMAGE_FILE_TYPE), false);
    }

    return cb(null, true);
  }
}
