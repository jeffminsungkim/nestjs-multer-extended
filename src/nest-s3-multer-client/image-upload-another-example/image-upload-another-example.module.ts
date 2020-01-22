import { Module } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { ImageUploadAnotherExampleController } from './image-upload-another-example.controller';
import { NestMulterS3Module } from '../../nest-s3-multer.module';

@Module({
  imports: [
    NestMulterS3Module.registerAsync({
      useFactory: (configService: ConfigService) => configService.get('aws-options-b'),
      inject: [ConfigService],
    }),
  ],
  controllers: [ImageUploadAnotherExampleController],
})
export class ImageUploadAnotherExampleModule {}
