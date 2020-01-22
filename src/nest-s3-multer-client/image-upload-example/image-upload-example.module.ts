import { Module } from '@nestjs/common';
import { ImageUploadController } from './image-upload.controller';
import { NestMulterS3Module } from '../../nest-s3-multer.module';

@Module({
  imports: [
    NestMulterS3Module.register({
      accessKeyId: 'API_KEY_HERE',
      secretAccessKey: 'SECRET_ACCESS_KEY_HERE',
      region: 'ap-northeast-2',
      bucket: 'BUCKET_NAME_HERE',
      appName: 'image-upload-example-module',
      fileSize: 10485760,
    }),
  ],
  controllers: [ImageUploadController],
})
export class ImageUploadExampleModule {}
