import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AmazonS3FileInterceptor } from '../../../lib/interceptors';
import { uid } from '../../fixtures/uid';

@Controller('image-upload')
export class ImageUploadController {
  @Post('without-dynamic-key-path')
  @UseInterceptors(AmazonS3FileInterceptor('file'))
  async uploadImageWithoutKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }

  @Post('with-dynamic-key-path')
  @UseInterceptors(AmazonS3FileInterceptor('file', { dynamicPath: uid }))
  async uploadImageWithKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }

  @Post('with-random-filename')
  @UseInterceptors(AmazonS3FileInterceptor('file', { randomFilename: true }))
  async uploadImageWithRandomFilenameKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }

  @Post('non-image-file')
  @UseInterceptors(AmazonS3FileInterceptor('file'))
  async uploadNonImageFile(@UploadedFile() file: any): Promise<void> {}

  @Post('non-image-file-no-filter')
  @UseInterceptors(AmazonS3FileInterceptor('file', { fileFilter: undefined }))
  async uploadNonImageFileWithoutFilter(@UploadedFile() file: any): Promise<any> {
    return file;
  }

  @Post('big-size-file')
  @UseInterceptors(AmazonS3FileInterceptor('file'))
  async uploadBigImage(@UploadedFile() file: any): Promise<void> {}

  @Post('big-size-file-higher-limit')
  @UseInterceptors(AmazonS3FileInterceptor('file', { limits: { fileSize: 3 * 1024 * 1024 } }))
  async uploadBigImageUsingCustomLimitOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }
}
