import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MulterExtendedS3Options, MulterExtendedS3AsyncOptions } from './interfaces';
import { MulterExtendedCoreModule } from './multer-extended-core.module';
import { MulterConfigService } from './multer-config.service';

@Module({})
export class MulterExtendedModule {
  static register(options?: MulterExtendedS3Options): DynamicModule {
    const ExtendedMulter = MulterExtendedCoreModule.register(options);
    return {
      module: MulterExtendedModule,
      imports: [
        ExtendedMulter,
        MulterModule.registerAsync({
          imports: [ExtendedMulter],
          useExisting: MulterConfigService,
        }),
      ],
      exports: [ExtendedMulter, MulterModule],
    };
  }

  static registerAsync(options: MulterExtendedS3AsyncOptions): DynamicModule {
    const ExtendedMulter = MulterExtendedCoreModule.registerAsync(options);
    return {
      module: MulterExtendedModule,
      imports: [
        ExtendedMulter,
        MulterModule.registerAsync({
          imports: [ExtendedMulter],
          useExisting: MulterConfigService,
        }),
      ],
      exports: [ExtendedMulter, MulterModule],
    };
  }
}
