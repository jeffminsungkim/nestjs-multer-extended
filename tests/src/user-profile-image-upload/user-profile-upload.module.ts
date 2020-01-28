import { Module } from '@nestjs/common';
import { UserProfileImageUploadController } from './user-profile-image-upload.controller';
import { MulterExtendedModule } from '../../../lib/multer-extended.module';
import { ConfigService } from 'nestjs-config';

@Module({
  imports: [
    MulterExtendedModule.registerAsync({
      useFactory: (configService: ConfigService) => configService.get('aws.optionA'),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserProfileImageUploadController],
})
export class UserProfileImageUploadModule {}
