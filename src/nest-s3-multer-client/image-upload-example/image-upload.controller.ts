import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AmazonS3FileInterceptor } from '../../interceptors';

@Controller('image-upload')
export class ImageUploadController {
  @Post('image/1')
  @UseInterceptors(AmazonS3FileInterceptor('file', null, 'root-path'))
  async uploadImage(@UploadedFile() file: any) {
    console.log('uploadImage() file:', file);
  }

  // @Post('image/2')
  // @UseInterceptors(AmazonS3FileInterceptor('file', null, 'image-upload-example/antoher-path'))
  // async uploadImage3(@UploadedFile() file: any) {
  //   console.log('uploadImage3() file:', file);
  // }
}
