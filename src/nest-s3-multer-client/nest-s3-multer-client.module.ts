/**
 *  NestS3MulterClientModule is a testing module that verifies that
 *  NestS3MulterModule was generated properly.
 *
 *  You can quickly verify this by running `npm run start:dev`, and then
 *  connecting to `http://localhost:3000` with your browser.  It should return
 *  a custom message like `Hello from NestS3MulterModule`.
 *
 *  Once you begin customizing NestS3MulterModule, you'll probably want
 *  to delete this module.
 */
import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { NestS3MulterClientController } from './nest-s3-multer-client.controller';
import { ImageUploadExampleModule } from './image-upload-example/image-upload-example.module';
import { NestMulterS3Module } from '../nest-s3-multer.module';
import { ImageUploadAnotherExampleModule } from './image-upload-another-example/image-upload-another-example.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}'), {
      path: path.resolve(process.cwd(), !ENV ? '.env' : `.env.${ENV}`),
    }),
    NestMulterS3Module.registerAsync({
      useFactory: (configService: ConfigService) => configService.get('aws'),
      inject: [ConfigService],
    }),
    // ImageUploadExampleModule,
    ImageUploadAnotherExampleModule,
  ],
  controllers: [NestS3MulterClientController],
})
export class NestS3MulterClientModule {}
