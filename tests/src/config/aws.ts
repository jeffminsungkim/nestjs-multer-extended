import { NestMulterS3Options } from '../../../lib/interfaces';

export default {
  optionA: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    basePath: 'user-profile-image-upload-module',
    fileSize: process.env.AWS_S3_MAX_IMAGE_SIZE,
  } as NestMulterS3Options,
  optionB: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    basePath: 'image-upload-module',
    fileSize: 10 * 1024 * 1024,
    acl: 'public-read',
  } as NestMulterS3Options,
};
