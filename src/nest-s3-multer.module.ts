import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { NestMulterS3Options, NestMulterS3AsyncOptions } from './interfaces';
import { NestMulterS3CoreModule } from './nest-s3-multer-core.module';
import { NestMulterS3Service } from './nest-multer-s3.service';

@Module({})
export class NestMulterS3Module {
  static register(options?: NestMulterS3Options): DynamicModule {
    return {
      module: NestMulterS3Module,
      imports: [NestMulterS3CoreModule.register(options)],
    };
  }

  static registerAsync(options: NestMulterS3AsyncOptions): DynamicModule {
    const NestS3Multer = NestMulterS3CoreModule.registerAsync(options);
    return {
      module: NestMulterS3Module,
      imports: [
        NestS3Multer,
        MulterModule.registerAsync({
          imports: [NestS3Multer],
          useExisting: NestMulterS3Service,
        }),
      ],
      exports: [NestS3Multer, MulterModule],
    };
  }
}
