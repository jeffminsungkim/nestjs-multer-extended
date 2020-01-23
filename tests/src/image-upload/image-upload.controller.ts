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
  @UseInterceptors(AmazonS3FileInterceptor('file', null, uid))
  async uploadImageWithKeyOption(@UploadedFile() file: any): Promise<any> {
    return file;
  }
}
