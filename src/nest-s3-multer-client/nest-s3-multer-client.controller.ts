/**
 *  NestS3MulterClientController is a testing controller that verifies that
 *  NestS3MulterModule was generated properly.
 *
 *  You can quickly verify this by running `npm run start:dev`, and then
 *  connecting to `http://localhost:3000` with your browser.  It should return
 *  a custom message like `Hello from NestS3MulterModule`.
 *
 *  Once you begin customizing NestS3MulterModule, you'll probably want
 *  to delete this controller.
 */
import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AmazonS3FileInterceptor } from '../interceptors';

@Controller()
export class NestS3MulterClientController {
  // @Post('upload/1')
  // @UseInterceptors(AmazonS3FileInterceptor('file'))
  // async uploadImage1(@UploadedFile() file: any) {
  //   console.log('uploadImage1() file:', file);
  // }

  // @Post('upload/2')
  // @UseInterceptors(AmazonS3FileInterceptor('file', null, 'image'))
  // async uploadImage2(@UploadedFile() file: any) {
  //   console.log('uploadImage2() file:', file);
  // }

  @Post('upload/3')
  @UseInterceptors(AmazonS3FileInterceptor('file', null, 'core-module-example-path'))
  async uploadImage3(@UploadedFile() file: any) {
    console.log('uploadImage3() file:', file);
  }
}
