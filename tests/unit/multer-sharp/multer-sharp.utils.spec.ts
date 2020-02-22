import 'jest-extended';
import { HttpException, PayloadTooLargeException, BadRequestException } from '@nestjs/common';
import AWS from 'aws-sdk';
import {
  transformImage,
  isOriginalSuffix,
  getSharpOptionProps,
  getSharpOptions,
  transformException,
} from '../../../lib/multer-sharp/multer-sharp.utils';
import { S3StorageOptions } from '../../../lib/multer-sharp/interfaces/s3-storage.interface';
import { SharpOptions } from '../../../lib/multer-sharp/interfaces/sharp-options.interface';
import { MulterExceptions } from '../../../lib/multer-sharp/enums';

describe('Shared Multer Sharp Utils', () => {
  describe('transformException', () => {
    describe('if error does not exist', () => {
      it('behave as identity', () => {
        const err = undefined;
        expect(transformException(err)).toEqual(err);
      });
    });
    describe('if error is instance of HttpException', () => {
      it('behave as identity', () => {
        const err = new HttpException('response', 500);
        expect(transformException(err)).toEqual(err);
      });
    });
    describe('if error exists and is not instance of HttpException', () => {
      describe('and is LIMIT_FILE_SIZE exception', () => {
        it('should return "PayloadTooLargeException"', () => {
          const err = { message: MulterExceptions.LIMIT_FILE_SIZE };
          expect(transformException(err as any)).toBeInstanceOf(PayloadTooLargeException);
        });
      });
      describe('and is multer exception but not a LIMIT_FILE_SIZE', () => {
        it('should return "BadRequestException"', () => {
          const err = { message: MulterExceptions.INVALID_IMAGE_FILE_TYPE };
          expect(transformException(err as any)).toBeInstanceOf(BadRequestException);
        });
      });
    });
  });

  describe('transformImage', () => {
    it('should return resolved image stream when the property is resize', () => {
      const option: SharpOptions = {
        resize: { width: 300, height: 350 },
      };
      expect(transformImage(option, option.resize)).toBeObject();
    });
  });

  describe('isOriginalSuffix', () => {
    it('should return true when the suffix is original', () => {
      expect(isOriginalSuffix('original')).toBeTruthy();
    });

    it('should return false when the suffix is not original', () => {
      expect(isOriginalSuffix('thumbnail')).toBeFalsy();
    });
  });

  describe('getSharpOptionProps', () => {
    let storageOpts: S3StorageOptions;

    beforeEach(() => {
      storageOpts = {
        s3: new AWS.S3(),
        resizeMultiple: [
          { suffix: 'xs', width: 100, height: 100 },
          { suffix: 'sm', width: 200, height: 200 },
          { suffix: 'md', width: 300, height: 300 },
          { suffix: 'lg', width: 400, height: 400 },
        ],
        resize: { width: 500, height: 450 },
      };
    });

    describe('The first set of property serves first', () => {
      it('should return an array of storage options when the resizeMultiple property set before the resize property', () => {
        expect(getSharpOptionProps(storageOpts)).toEqual([
          { suffix: 'xs', width: 100, height: 100 },
          { suffix: 'sm', width: 200, height: 200 },
          { suffix: 'md', width: 300, height: 300 },
          { suffix: 'lg', width: 400, height: 400 },
        ]);
      });

      it('should return an object value of resize property when the resizeMultiple property is missing', () => {
        delete storageOpts.resizeMultiple;

        expect(getSharpOptionProps(storageOpts)).toEqual({ width: 500, height: 450 });
      });
    });
  });

  describe('getSharpOptions', () => {
    let options: SharpOptions;

    beforeEach(() => {
      options = {
        resize: { width: 500, height: 450 },
        ignoreAspectRatio: true,
      };
    });

    it('should return SharpOptions', () => {
      expect(getSharpOptions(options)).toContainAllEntries([
        ['resizeMultiple', undefined],
        ['resize', { width: 500, height: 450 }],
        ['ignoreAspectRatio', true],
      ]);
    });
  });
});
