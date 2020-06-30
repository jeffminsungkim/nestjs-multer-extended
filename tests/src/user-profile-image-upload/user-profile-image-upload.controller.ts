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
  @UseInterceptors(AmazonS3FileInterceptor('file', { dynamicPath: uid }))
  async uploadImageWithKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }

  @Post('use-path-param-as-a-key/:key')
  @UseInterceptors(AmazonS3FileInterceptor('file', { dynamicPath: 'key' }))
  async uploadImageWithPathParamKey(@UploadedFile() file: any): Promise<any> {
    return file;
  }

  @Post('use-path-param-as-a-key/:key/user/:id')
  @UseInterceptors(AmazonS3FileInterceptor('file', { dynamicPath: ['key', 'id'] }))
  async uploadImageWithMultiplePathParamKeys(@UploadedFile() file: any): Promise<any> {
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

  @Post('create-thumbnail-with-dynamic-key')
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      thumbnail: { suffix: 'thumb', width: 200, height: 200 },
      limits: { fileSize: 2 * 1024 * 1024 },
      dynamicPath: `${uid}/test`,
    }),
  )
  async uploadImageWithDynamicKey(@UploadedFile() file: any): Promise<any> {
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

  @Post('different-sizes')
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      resizeMultiple: [
        { suffix: 'sm', width: 200, height: 200 },
        { suffix: 'md', width: 300, height: 300 },
        { suffix: 'lg', width: 400, height: 400 },
      ],
      dynamicPath: `${uid}/different-sizes`,
    }),
  )
  async uploadImageWithDifferentSizes(@UploadedFile() file: any): Promise<any> {
    return file;
  }
}
