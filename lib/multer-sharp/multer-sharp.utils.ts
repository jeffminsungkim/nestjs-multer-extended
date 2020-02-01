import { BadRequestException, HttpException, PayloadTooLargeException } from '@nestjs/common';
import sharp, { Sharp } from 'sharp';
import { SharpOptions, ResizeOption } from './interfaces/sharp-options.interface';
import { ExtendedOptions, MulterExceptions } from './enums';

export const transformException = (error: Error | undefined) => {
  if (!error || error instanceof HttpException) {
    return error;
  }
  switch (error.message) {
    case MulterExceptions.LIMIT_FILE_SIZE:
      return new PayloadTooLargeException(error.message);
    case MulterExceptions.LIMIT_FILE_COUNT:
    case MulterExceptions.LIMIT_FIELD_KEY:
    case MulterExceptions.LIMIT_FIELD_VALUE:
    case MulterExceptions.LIMIT_FIELD_COUNT:
    case MulterExceptions.LIMIT_UNEXPECTED_FILE:
    case MulterExceptions.LIMIT_PART_COUNT:
      return new BadRequestException(error.message);
  }
  return error;
};

export const transformImage = (options: SharpOptions, size: ResizeOption): Sharp => {
  let imageStream = sharp();

  for (const [key, value] of Object.entries(options)) {
    if (value) {
      imageStream = resolveImageStream(key, value, size, imageStream);
    }
  }
  return imageStream;
};

export const isOriginalSuffix = (suffix: string) => suffix === 'original';
const isObject = obj => typeof obj === 'object' && obj !== null;

const resolveImageStream = (key: string, value, size, imageStream: Sharp) => {
  switch (key) {
    case ExtendedOptions.RESIZE_IMAGE:
      if (isObject(size)) {
        imageStream = imageStream.resize(size.width, size.height, size.options);
      }
      break;
    default:
      break;
  }

  return imageStream;
};

export const getSharpOptions = (options: SharpOptions): SharpOptions => {
  return {
    resize: options.resize,
    ignoreAspectRatio: options.ignoreAspectRatio,
  };
};
