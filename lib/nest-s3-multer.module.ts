import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { NestMulterS3Options, NestMulterS3AsyncOptions } from './interfaces';
import { NestMulterS3CoreModule } from './nest-s3-multer-core.module';
import { NestMulterS3Service } from './nest-multer-s3.service';

@Module({})
export class NestMulterS3Module {
  static register(options?: NestMulterS3Options): DynamicModule {
    const NestMulterS3 = NestMulterS3CoreModule.register(options);
    return {
      module: NestMulterS3Module,
      imports: [
        NestMulterS3,
        MulterModule.registerAsync({
          imports: [NestMulterS3],
          useExisting: NestMulterS3Service,
        }),
      ],
      exports: [NestMulterS3, MulterModule],
    };
  }

  static registerAsync(options: NestMulterS3AsyncOptions): DynamicModule {
    const NestMulterS3 = NestMulterS3CoreModule.registerAsync(options);
    return {
      module: NestMulterS3Module,
      imports: [
        NestMulterS3,
        MulterModule.registerAsync({
          imports: [NestMulterS3],
          useExisting: NestMulterS3Service,
        }),
      ],
      exports: [NestMulterS3, MulterModule],
    };
  }
}
