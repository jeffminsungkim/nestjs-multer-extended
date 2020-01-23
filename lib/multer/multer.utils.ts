import { BadRequestException, HttpException, PayloadTooLargeException } from '@nestjs/common';
import { MulterExceptions } from './multer-exceptions.enum';

export function transformException(error: Error | undefined) {
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
}
