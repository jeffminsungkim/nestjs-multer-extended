import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { UserProfileImageUploadModule } from './user-profile-image-upload/user-profile-upload.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}')),
    UserProfileImageUploadModule,
    ImageUploadModule,
  ],
})
export class AppModule {}
