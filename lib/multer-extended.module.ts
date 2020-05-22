import { Module, DynamicModule, Provider } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { MulterConfigLoader } from './multer-config.loader';
import {
  createMulterExtendedProviders,
  createMulterOptionsFactory,
} from './multer-extended.providers';
import {
  MULTER_EXTENDED_S3_OPTIONS,
  MULTER_EXTENDED_S3_MODULE_ID,
  MULTER_MODULE_OPTIONS,
} from './constants';
import {
  MulterExtendedS3Options,
  MulterExtendedS3AsyncOptions,
  MulterExtendedS3OptionsFactory,
} from './interfaces';

@Module({
  providers: [MulterConfigLoader],
  exports: [MulterConfigLoader],
})
export class MulterExtendedModule {
  public static register(options: MulterExtendedS3Options): DynamicModule {
    return {
      module: MulterExtendedModule,
      providers: createMulterExtendedProviders(options),
      exports: [MULTER_EXTENDED_S3_OPTIONS, MULTER_MODULE_OPTIONS],
    };
  }

  public static registerAsync(options: MulterExtendedS3AsyncOptions): DynamicModule {
    return {
      module: MulterExtendedModule,
      imports: options.imports,
      providers: [
        ...this.createProviders(options),
        {
          provide: MULTER_EXTENDED_S3_MODULE_ID,
          useValue: randomStringGenerator(),
        },
        createMulterOptionsFactory,
      ],
      exports: [MULTER_EXTENDED_S3_OPTIONS, MULTER_MODULE_OPTIONS],
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
