import { Module, DynamicModule, Provider } from '@nestjs/common';
import { MulterConfigService } from './multer-config.service';
import { createNestS3MulterProviders } from './nest-s3-multer.providers';
import { MULTER_EXTENDED_S3_OPTIONS, MULTER_EXTENDED_S3_MODULE_ID } from './constants';
import { randomStringGenerator } from './utils/random-string-generator.util';
import {
  MulterExtendedS3Options,
  MulterExtendedS3AsyncOptions,
  MulterExtendedS3OptionsFactory,
} from './interfaces';

@Module({
  providers: [MulterConfigService],
  exports: [MulterConfigService],
})
export class MulterExtendedCoreModule {
  public static register(options: MulterExtendedS3Options): DynamicModule {
    return {
      module: MulterExtendedCoreModule,
      providers: createNestS3MulterProviders(options),
      exports: [MULTER_EXTENDED_S3_OPTIONS],
    };
  }

  public static registerAsync(options: MulterExtendedS3AsyncOptions): DynamicModule {
    return {
      module: MulterExtendedCoreModule,
      providers: [
        ...this.createProviders(options),
        {
          provide: MULTER_EXTENDED_S3_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
      exports: [MULTER_EXTENDED_S3_OPTIONS],
    };
  }

  private static createProviders(options: MulterExtendedS3AsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createOptionsProvider(options: MulterExtendedS3AsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: MULTER_EXTENDED_S3_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: MULTER_EXTENDED_S3_OPTIONS,
      useFactory: async (optionsFactory: MulterExtendedS3OptionsFactory) =>
        optionsFactory.createMulterExtendedS3Options(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
