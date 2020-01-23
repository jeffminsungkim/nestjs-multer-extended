import { Module } from '@nestjs/common';
import { ImageUploadController } from './image-upload.controller';
import { NestMulterS3Module } from '../../../lib/nest-s3-multer.module';
import { ConfigService } from 'nestjs-config';

@Module({
  imports: [
    NestMulterS3Module.registerAsync({
      useFactory: (configService: ConfigService) => configService.get('aws.optionB'),
      inject: [ConfigService],
    }),
  ],
  controllers: [ImageUploadController],
})
export class ImageUploadModule {}
