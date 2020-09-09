import sharp, { Sharp } from 'sharp';
import { StorageEngine } from 'multer';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { isFunction, isString } from '@nestjs/common/utils/shared.utils';
import { Request } from 'express';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray, first } from 'rxjs/operators';
import { lookup, extension } from 'mime-types';
import { S3StorageOptions, S3Storage } from './interfaces/s3-storage.interface';
import { SharpOptions, Size, ExtendSize } from './interfaces/sharp-options.interface';
import {
  getSharpOptions,
  getSharpOptionProps,
  transformImage,
  isOriginalSuffix,
} from './multer-sharp.utils';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export interface EventStream {
  stream: NodeJS.ReadableStream & Sharp;
}
export type File = Express.Multer.File & EventStream & Partial<S3.Types.PutObjectRequest>;
export type Info = Partial<
  Express.Multer.File & ManagedUpload.SendData & S3.Types.PutObjectRequest & sharp.OutputInfo
>;

export class MulterSharp implements StorageEngine, S3Storage {
  storageOpts: S3StorageOptions;
  sharpOpts: SharpOptions;

  constructor(options: S3StorageOptions) {
    if (!options.s3) {
      throw new Error('You have to specify s3 object.');
    }

    this.storageOpts = options;
    this.sharpOpts = getSharpOptions(options);

    if (!this.storageOpts.Bucket) {
      throw new Error('You have to specify Bucket property.');
    }

    if (!isFunction(this.storageOpts.Key) && !isString(this.storageOpts.Key)) {
      throw new TypeError(`Key must be a "string", "function" or undefined`);
    }
  }

  public _removeFile(req: Request, file: Info, cb: (error: Error) => void) {
    this.storageOpts.s3.deleteObject({ Bucket: file.Bucket, Key: file.Key }, cb);
  }

  public _handleFile(
    req: Request,
    file: File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    const { storageOpts } = this;
    const { mimetype, stream } = file;
    const params = {
      Bucket: storageOpts.Bucket,
      ACL: storageOpts.ACL,
      CacheControl: storageOpts.CacheControl,
      ContentType: storageOpts.ContentType,
      Metadata: storageOpts.Metadata,
      StorageClass: storageOpts.StorageClass,
      ServerSideEncryption: storageOpts.ServerSideEncryption,
      SSEKMSKeyId: storageOpts.SSEKMSKeyId,
      Body: stream,
      Key: storageOpts.Key,
    };

    if (isFunction(storageOpts.Key)) {
      storageOpts.Key(req, file, (err, Key) => {
        if (err) {
          callback(err);
          return;
        }

        let { originalname } = file;

        if (storageOpts.randomFilename) {
          originalname = `${randomStringGenerator()}.${extension(mimetype)}`;
        }

        const routeParams = Object.keys(req.params);

        if (routeParams.length > 0 && storageOpts.dynamicPath) {
          if (typeof storageOpts.dynamicPath === 'string') {
            params.Key = routeParams.includes(storageOpts.dynamicPath)
              ? `${Key}/${req.params[storageOpts.dynamicPath]}/${originalname}`
              : `${Key}/${storageOpts.dynamicPath}/${originalname}`;
          } else {
            const paramDir = [];
            storageOpts.dynamicPath.forEach((pathSegment) => {
              paramDir.push(routeParams.includes(pathSegment) ? req.params[pathSegment] : pathSegment);
            });
            params.Key = `${Key}/${paramDir.join('/')}/${originalname}`;
          }
        } else {
          params.Key = storageOpts.dynamicPath
            ? `${Key}/${storageOpts.dynamicPath}/${originalname}`
            : `${Key}/${originalname}`;
        }

        mimetype.includes('image')
          ? this.uploadImageFileToS3(params, file, callback)
          : this.uploadFileToS3(params, file, callback);
      });
    }
  }

  private uploadImageFileToS3(
    params: S3.Types.PutObjectRequest,
    file: File,
    callback: (error?: any, info?: Info) => void,
  ) {
    const { storageOpts, sharpOpts } = this;
    const { stream } = file;
    const {
      ACL,
      ContentDisposition,
      ContentType: optsContentType,
      StorageClass,
      ServerSideEncryption,
      Metadata,
    } = storageOpts;

    const resizeBucket = getSharpOptionProps(storageOpts);

    if (Array.isArray(resizeBucket) && resizeBucket.length > 0) {
      const sizes$ = from(resizeBucket) as Observable<Size & ExtendSize>;

      sizes$
        .pipe(
          map((size) => {
            const resizedStream = transformImage(sharpOpts, size);

            if (isOriginalSuffix(size.suffix)) {
              size.Body = stream.pipe(sharp({ failOnError: false }));
            } else {
              size.Body = stream.pipe(resizedStream);
            }
            return size;
          }),
          mergeMap((size) => {
            const sharpStream = size.Body;
            const sharpPromise = sharpStream.toBuffer({ resolveWithObject: true });

            return from(
              sharpPromise.then((result) => {
                return {
                  ...size,
                  ...result.info,
                  ContentType: result.info.format,
                  currentSize: result.info.size,
                };
              }),
            );
          }),
          mergeMap((size) => {
            const { Body, ContentType } = size;
            const newParams = {
              ...params,
              Body,
              ContentType,
              Key: `${params.Key}-${size.suffix}`,
            };
            const upload = storageOpts.s3.upload(newParams);
            const currentSize = { [size.suffix]: 0 };

            upload.on('httpUploadProgress', (event) => {
              if (event.total) {
                currentSize[size.suffix] = event.total;
              }
            });

            const upload$ = from(
              upload.promise().then((result) => {
                // tslint:disable-next-line
                const { Body, ...rest } = size;
                return {
                  ...result,
                  ...rest,
                  currentSize: size.currentSize || currentSize[size.suffix],
                };
              }),
            );
            return upload$;
          }),
          toArray(),
          first(),
        )
        .subscribe((response) => {
          const multipleUploadedFiles = response.reduce((acc, uploadedFile) => {
            // tslint:disable-next-line
            const { suffix, ContentType, currentSize, ...details } = uploadedFile;
            acc[uploadedFile.suffix] = {
              ACL,
              ContentDisposition,
              StorageClass,
              ServerSideEncryption,
              Metadata,
              ...details,
              size: currentSize,
              ContentType: optsContentType || ContentType,
              mimetype: lookup(ContentType) || `image/${ContentType}`,
            };
            return acc;
          }, {});
          callback(null, JSON.parse(JSON.stringify(multipleUploadedFiles)));
        }, callback);
    } else {
      let currentSize = 0;
      const resizedStream = transformImage(sharpOpts, sharpOpts.resize);
      const newParams = { ...params, Body: stream.pipe(resizedStream) };
      const meta$ = from(newParams.Body.toBuffer({ resolveWithObject: true }));

      meta$
        .pipe(
          first(),
          map((metadata) => {
            newParams.ContentType = storageOpts.ContentType || metadata.info.format;
            return metadata;
          }),
          mergeMap((metadata) => {
            const upload = storageOpts.s3.upload(newParams);

            upload.on('httpUploadProgress', (eventProgress) => {
              if (eventProgress.total) {
                currentSize = eventProgress.total;
              }
            });

            const data = upload
              .promise()
              .then((uploadedData) => ({ ...uploadedData, ...metadata.info }));
            const upload$ = from(data);
            return upload$;
          }),
        )
        .subscribe((response) => {
          const { size, format, channels, ...details } = response;
          const data = {
            ACL,
            ContentDisposition,
            StorageClass,
            ServerSideEncryption,
            Metadata,
            ...details,
            size: currentSize || size,
            ContentType: storageOpts.ContentType || format,
            mimetype: lookup(format) || `image/${format}`,
          };
          callback(null, JSON.parse(JSON.stringify(data)));
        }, callback);
    }
  }

  private uploadFileToS3(
    params: S3.Types.PutObjectRequest,
    file: File,
    callback: (error?: any, info?: Info) => void,
  ) {
    const { storageOpts } = this;
    const { mimetype } = file;

    params.ContentType = params.ContentType || mimetype;

    const upload = storageOpts.s3.upload(params);
    let currentSize = 0;

    upload.on('httpUploadProgress', (event) => {
      if (event.total) {
        currentSize = event.total;
      }
    });

    upload.promise().then((uploadedData) => {
      const data = {
        size: currentSize,
        ACL: storageOpts.ACL,
        ContentType: storageOpts.ContentType || mimetype,
        ContentDisposition: storageOpts.ContentDisposition,
        StorageClass: storageOpts.StorageClass,
        ServerSideEncryption: storageOpts.ServerSideEncryption,
        Metadata: storageOpts.Metadata,
        ...uploadedData,
      };
      callback(null, JSON.parse(JSON.stringify(data)));
    }, callback);
  }
}
