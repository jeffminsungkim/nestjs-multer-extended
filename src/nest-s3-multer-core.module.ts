import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { NestMulterS3Service } from './nest-multer-s3.service';
import { createNestS3MulterProviders } from './nest-s3-multer.providers';
import { NEST_MULTER_S3_OPTIONS, NEST_S3_MULTER_MODULE_ID } from './constants';
import {
  NestMulterS3Options,
  NestMulterS3AsyncOptions,
  NestMulterS3OptionsFactory,
} from './interfaces';
import { randomStringGenerator } from './utils/random-string-generator.util';

@Global()
@Module({
  providers: [NestMulterS3Service],
  exports: [NestMulterS3Service],
})
export class NestMulterS3CoreModule {
  /**
   * Registers a configured NestS3Multer Module for import into the current module
   */
  public static register(options: NestMulterS3Options): DynamicModule {
    // console.log('register:', createNestS3MulterProviders(options));
    return {
      module: NestMulterS3CoreModule,
      providers: createNestS3MulterProviders(options),
      exports: [NEST_MULTER_S3_OPTIONS],
    };
  }

  /**
   * Registers a configured NestS3Multer Module for import into the current module
   * using dynamic options (factory, etc)
   */
  public static registerAsync(options: NestMulterS3AsyncOptions): DynamicModule {
    return {
      module: NestMulterS3CoreModule,
      providers: [
        ...this.createProviders(options),
        {
          provide: NEST_S3_MULTER_MODULE_ID,
          useValue: randomStringGenerator(),
        },
      ],
      exports: [NEST_MULTER_S3_OPTIONS],
    };
  }

  private static createProviders(options: NestMulterS3AsyncOptions): Provider[] {
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

  private static createOptionsProvider(options: NestMulterS3AsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_MULTER_S3_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting...
    return {
      provide: NEST_MULTER_S3_OPTIONS,
      useFactory: async (optionsFactory: NestMulterS3OptionsFactory) =>
        await optionsFactory.createNestMulterS3Options(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
