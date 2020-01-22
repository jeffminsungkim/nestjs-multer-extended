import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AmazonS3FileInterceptor } from '../../interceptors';

@Controller('image-upload-another-example')
export class ImageUploadAnotherExampleController {
  // @Post('image/1')
  // @UseInterceptors(AmazonS3FileInterceptor('file', null, 'root-path'))
  // async uploadImage(@UploadedFile() file: any) {
  //   console.log('uploadImage() file:', file);
  // }

  @Post('image/2')
  @UseInterceptors(AmazonS3FileInterceptor('file'))
  async uploadImage2(@UploadedFile() file: any) {
    console.log('uploadImage2() file:', file);
  }
}
