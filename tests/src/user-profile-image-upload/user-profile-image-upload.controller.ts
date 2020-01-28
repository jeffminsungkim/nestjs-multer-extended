import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AmazonS3FileInterceptor } from '../../../lib/interceptors';
import { uid } from '../../fixtures/uid';

@Controller('user-profile-image-upload')
export class UserProfileImageUploadController {
  @Post('without-dynamic-key-path')
  @UseInterceptors(AmazonS3FileInterceptor('file'))
  async uploadImageWithoutKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }
  @Post('with-dynamic-key-path')
  @UseInterceptors(AmazonS3FileInterceptor('file', null, uid))
  async uploadImageWithKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }
  @Post('create-thumbnail-with-custom-options')
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      thumbnail: { suffix: 'thumbnail', width: 250, height: 250 },
      limits: { fileSize: 7 * 1024 * 1024 },
    }),
  )
  async uploadImageWithThumbnail(@UploadedFile() file: any): Promise<any> {
    return file;
  }
  @Post('resized')
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      resize: { width: 500, height: 450 },
    }),
  )
  async uploadResizedImage(@UploadedFile() file: any): Promise<any> {
    return file;
  }
}
