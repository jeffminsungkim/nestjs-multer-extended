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
import { MulterModuleOptions } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Observable } from 'rxjs';
import { NEST_MULTER_S3_OPTIONS } from '../constants';
import { NestMulterS3Options } from '../interfaces';
import { transformException } from '../multer/multer.utils';

type MulterInstance = any;

export function AmazonS3FileInterceptor(
  fieldName: string,
  localOptions?: MulterOptions,
  key?: string,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;
    private basePath: string;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: MulterModuleOptions = {},
      @Inject(NEST_MULTER_S3_OPTIONS)
      nestMulterS3Options: NestMulterS3Options,
    ) {
      this.multer = (multer as any)({
        ...options,
        ...localOptions,
      });

      this.basePath = key
        ? `${nestMulterS3Options.basePath}/${key}`
        : `${nestMulterS3Options.basePath}`;
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      this.multer.storage.opts.Key = (req, file, cb) => {
        const { originalname } = file;

        cb(null, `${this.basePath}/${originalname}`);
      };

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
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
