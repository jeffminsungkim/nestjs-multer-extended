import { NestMulterS3Options } from '../../../src/interfaces';

export default {
  optionA: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
    bucket: process.env.AWS_S3_BUCKET_NAME,
    appName: process.env.AWS_S3_APP_NAME,
    fileSize: process.env.AWS_S3_MAX_IMAGE_SIZE || 3145728,
  } as NestMulterS3Options,
  optionB: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
    bucket: process.env.AWS_S3_BUCKET_NAME,
    appName: 'image-upload-another-example-module',
    fileSize: 3145728,
    acl: 'public-read',
  } as NestMulterS3Options,
};
