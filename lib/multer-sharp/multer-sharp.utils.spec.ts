import 'jest-extended';
import {
  transformImage,
  isOriginalSuffix,
  getSharpOptionProps,
  getSharpOptions,
} from './multer-sharp.utils';
import { S3StorageOptions } from './interfaces/s3-storage.interface';
import { SharpOptions } from './interfaces/sharp-options.interface';
import AWS from 'aws-sdk';

describe('Shared Multer Sharp Utils', () => {
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
