import { MulterExtendedS3Options } from '../../../lib/interfaces';
import {
  IMAGE_UPLOAD_MODULE_BASE_PATH,
  USER_PROFILE_IMAGE_UPLOAD_MODULE_BASE_PATH,
} from '../../fixtures/base-path.constants';
import { Logger } from '@nestjs/common';

export default {
  optionA: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    basePath: USER_PROFILE_IMAGE_UPLOAD_MODULE_BASE_PATH,
    fileSize: process.env.AWS_S3_MAX_IMAGE_SIZE,
  } as MulterExtendedS3Options,
  optionB: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    basePath: IMAGE_UPLOAD_MODULE_BASE_PATH,
    fileSize: 1 * 1024 * 1024,
    acl: 'private',
    logger: new Logger('Test Logger'),
  } as MulterExtendedS3Options,
};
