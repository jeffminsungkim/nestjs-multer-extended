import {
  Type,
  NestInterceptor,
  Optional,
  Inject,
  ExecutionContext,
  CallHandler,
  mixin,
} from '@nestjs/common';
import multer from 'multer';
import { Observable } from 'rxjs';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import { MulterExtendedOptions } from '../interfaces';
import { AmazonS3Storage, ExtendedOptions, transformException } from '../multer-sharp';
import { S3StorageOptions } from '../multer-sharp/interfaces/s3-storage.interface';

type MulterInstance = any;

export function AmazonS3FileInterceptor(
  fieldName: string,
  localOptions?: MulterExtendedOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;
    private localOptions: MulterExtendedOptions;
    private options: MulterModuleOptions;

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},
    ) {
      this.localOptions = localOptions;
      this.options = options;

      this.multer = (multer as any)({
        ...this.options,
        ...this.localOptions,
      });
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      if (this.localOptions) {
        this.multer.storage = this.pickStorageOptions();
      }

      await new Promise((resolve, reject) =>
        this.multer.single(fieldName)(ctx.getRequest(), ctx.getResponse(), (err: any) => {
          if (err) {
            const error = transformException(err);
            return reject(error);
          }
          resolve();
        }),
      );

      return next.handle();
    }

    private pickStorageOptions() {
      let storageOptions: S3StorageOptions;
      const extendedOptionProperty = Object.keys(this.localOptions)[0];

      switch (extendedOptionProperty) {
        case ExtendedOptions.CREATE_THUMBNAIL:
          storageOptions = {
            ...this.options.storage.storageOpts,
            resize: [this.localOptions[extendedOptionProperty], { suffix: 'original' }],
            ignoreAspectRatio: true,
            dynamicPath: this.localOptions.dynamicPath,
          };
          return AmazonS3Storage(storageOptions);
        case ExtendedOptions.RESIZE_IMAGE:
          storageOptions = {
            ...this.options.storage.storageOpts,
            resize: this.localOptions[extendedOptionProperty],
            dynamicPath: this.localOptions.dynamicPath,
          };
          return AmazonS3Storage(storageOptions);
        case ExtendedOptions.RESIZE_IMAGE_MULTIPLE_SIZES:
          storageOptions = {
            ...this.options.storage.storageOpts,
            resizeMultiple: this.localOptions[extendedOptionProperty],
            ignoreAspectRatio: true,
            dynamicPath: this.localOptions.dynamicPath,
          };
          return AmazonS3Storage(storageOptions);
        default:
          return AmazonS3Storage({ ...this.options.storage.storageOpts, ...this.localOptions });
      }
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
