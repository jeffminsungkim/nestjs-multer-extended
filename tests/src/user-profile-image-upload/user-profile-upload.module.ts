import { Module } from '@nestjs/common';
import { UserProfileImageUploadController } from './user-profile-image-upload.controller';
import { NestMulterS3Module } from '../../../lib/nest-s3-multer.module';
import { ConfigService } from 'nestjs-config';

@Module({
  imports: [
    NestMulterS3Module.registerAsync({
      useFactory: (configService: ConfigService) => configService.get('aws.optionA'),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserProfileImageUploadController],
})
export class UserProfileImageUploadModule {}
