import { Module } from '@nestjs/common';
import { ImageUploadController } from './image-upload.controller';
import { MulterExtendedModule } from '../../../lib/multer-extended.module';
import { ConfigService } from 'nestjs-config';

@Module({
  imports: [
    MulterExtendedModule.registerAsync({
      useFactory: (configService: ConfigService) => configService.get('aws.optionB'),
      inject: [ConfigService],
    }),
  ],
  controllers: [ImageUploadController],
})
export class ImageUploadModule {}
