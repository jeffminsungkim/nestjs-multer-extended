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
import s3Storage from 'multer-sharp-s3';
import { Observable } from 'rxjs';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import { MULTER_EXTENDED_S3_OPTIONS } from '../constants';
import { MulterExtendedS3Options } from '../interfaces';
import { transformException } from '../multer/multer.utils';
import { ExtendedOptions } from '../multer/extended-options.enum';
import { MulterExtendedOptions } from '../interfaces/multer-extended-options.interface';

type MulterInstance = any;

export function AmazonS3FileInterceptor(
  fieldName: string,
  localOptions?: MulterExtendedOptions,
  key?: string,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;
    private basePath: string;
    private localOptions: MulterExtendedOptions;
    private options: MulterModuleOptions;

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},
      @Inject(MULTER_EXTENDED_S3_OPTIONS)
      nestMulterS3Options: MulterExtendedS3Options,
    ) {
      this.localOptions = localOptions;
      this.options = options;

      this.multer = (multer as any)({
        ...this.options,
        ...this.localOptions,
      });

      this.basePath = key
        ? `${nestMulterS3Options.basePath}/${key}`
        : `${nestMulterS3Options.basePath}`;
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      if (this.checkValidOptionsInput()) {
        this.multer.storage = this.pickStorageOptions();
      }

      this.multer.storage.opts.Key = (req, file, cb) => {
        const { originalname } = file;

        cb(null, `${this.basePath}/${originalname}`);
      };

      const ctx = context.switchToHttp();

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

    private checkValidOptionsInput(): boolean {
      if (!this.localOptions) {
        return false;
      }

      const options = Object.keys(this.localOptions);
      return options.some(option => option === 'thumbnail' || option === 'resize');
    }

    private pickStorageOptions() {
      let storageOptions;

      const extendedOptionProperty = Object.keys(this.localOptions)[0];

      switch (extendedOptionProperty) {
        case ExtendedOptions.CREATE_THUMBNAIL:
          storageOptions = {
            ...this.options.storage.opts,
            resize: !Array.isArray(this.localOptions[extendedOptionProperty])
              ? [this.localOptions[extendedOptionProperty], { suffix: 'original' }]
              : this.localOptions[extendedOptionProperty],
            multiple: true,
            ignoreAspectRatio: true,
          };
          return s3Storage(storageOptions);
        case ExtendedOptions.RESIZE_IMAGE:
          storageOptions = {
            ...this.options.storage.opts,
            resize: this.localOptions[extendedOptionProperty],
          };
          return s3Storage(storageOptions);
        default:
          break;
      }
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
