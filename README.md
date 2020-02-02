<h1 align="center">
<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="./media/header-light-theme.png" width="600" alt="NestJS Multer Extended Logo" />
  </a>
</div>
</h1>

<div align="center">
  <a href="https://circleci.com/gh/jeffminsungkim/nestjs-multer-extended" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/jeffminsungkim/nestjs-multer-extended/master" alt="CircleCI">
  </a>
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-e0234e.svg" alt="Built with NestJS">
  </a>
  <a href="https://github.com/nestjsplus/dyn-schematics" target="_blank">
    <img src="https://img.shields.io/badge/Built%20with-%40nestjsplus%2Fdyn--schematics-brightgreen" alt="Built with @nestjsplus/dyn-schematics">
  </a>
  <a href="http://commitizen.github.io/cz-cli/" target="_blank">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen">
  </a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome"/>
  <a href="https://www.buymeacoffee.com/jeffminsungkim" target="_blank">
    <img src="https://badgen.net/badge/Buy%20Me/A%20Coffee/orange?icon=kofi" alt="Buymeacoffee">
  </a>
</div>

## Features

- Single file upload to an Amazon S3 bucket
- Support for dynamic paths, upload files wherever you want!
- Generate thumbnail image along with the original
- Resize single/multiple images
- Load AWS S3 configuration at runtime

## Installation

**NPM**
```bash
$ npm i -s nestjs-multer-extended
```

**Yarn**
```bash
$ yarn add nestjs-multer-extended
```

## Getting started

Once the installation process is complete, we can import the module either synchronously or asynchronosly into the root `AppModule`.

&nbsp;

### Synchronous configuration

```typescript
import { Module } from '@nestjs/common';
import { MulterExtendedModule } from 'nestjs-multer-extended';

@Module({
  imports: [
    MulterExtendedModule.register({
      accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
      region: 'AWS_REGION_NEAR_TO_YOU',
      bucket: 'YOUR_S3_BUCKET_NAME',
      basePath: 'ROOT_DIR_OF_ASSETS',
      fileSize: 1 * 1024 * 1024,
    }),
  ],
})
export class AppModule {}
```

### Asynchronous configuration

In this example, the module integrates with the awesome [nestjs-config](https://github.com/nestjsx/nestjs-config) package.

`useFactory` should return an object with [MulterExtendedS3Options interface](#MulterExtendedS3Options) or undefined.

```typescript
import { Module } from '@nestjs/common';
import { MulterExtendedModule } from 'nestjs-multer-extended';
import { ConfigService } from 'nestjs-config';

@Module({
  imports: [
    MulterExtendedModule.registerAsync({
      useFactory: (config: ConfigService) => config.get('s3'),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

> **Note**: You can import this module from not only the root module of your app but also from other feature modules where you want to use it.

&nbsp;

To upload a single file, simply tie the `AmazonS3FileInterceptor()` interceptor to the route handler and extract `file` from the request using the `@UploadedFile()` decorator.

```typescript
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

@Controller()
export class AppController {

  @Post('upload')
  @UseInterceptors(AmazonS3FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file);
  }
}
```

In this example, `uploadFile()` method will upload a file under the base path you have configured earlrier.

The `AmazonS3FileInterceptor()` decorator takes two arguments:

- `fieldName`: string that supplies the name of the field from the HTML form that holds a file.
- `options`: optional object of type `MulterExtendedOptions`. (mode details [**here**](#MulterExtendedOptions))

What if you wanted to upload a file in a different location under the base path? Thankfully, `AmazonS3FileInterceptor()` decorator accepts `dynamicPath` property as a second argument option. Pass the string path as shown below:

```typescript
@Post('upload')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    dynamicPath: 'aec16138-a75a-4961-b8c1-8e803b6bf2cf'
  }),
)
uploadFile(@UploadedFile() file) {
  console.log(file);
}
```

In this example, `uploadFile()` method will upload a file in `${basePath}/aec16138-a75a-4961-b8c1-8e803b6bf2cf/${originalname}`.

If you want to resize the file before the upload, you can pass on the resize property as follows:

```typescript
@Post('upload')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    resize: { width: 500, height: 400 },
  }),
)
uploadFile(@UploadedFile() file) {
  console.log(file);
}
```

Not only creating a thumbnail image but also willing to change the file size limit, you can pass the properties as follows:

```typescript
@Post('upload')
@UseInterceptors(
    AmazonS3FileInterceptor('file', {
      thumbnail: { suffix: 'thumb', width: 200, height: 200 },
      limits: { fileSize: 7 * 1024 * 1024 },
    }),
  )
uploadFile(@UploadedFile() file) {
  console.log(file);
}
```

In this example, `uploadFile()` method will upload both thumbnail and original images.

&nbsp;

### MulterExtendedS3Options

`MulterExtendedModule` requires an object with the following interface:

```typescript
interface MulterExtendedS3Options {
  /**
   * AWS Access Key ID
   */
  readonly accessKeyId: string;
  /**
   * AWS Secret Access Key
   */
  readonly secretAccessKey: string;
  /**
   * Default region name
   * default: us-west-2
   */
  readonly region: string;
  /**
   * The name of Amazon S3 bucket
   */
  readonly bucket: string;
  /**
   * The base path where you want to store files in
   */
  readonly basePath: string;
  /**
   * Optional parameter for Access control level for the file
   * default: public-read
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
   */
  readonly acl?: string;
  /**
   * Optional parameter for the file size
   * default: 3MB
   */
  readonly fileSize?: number | string;
  /**
   * Optional parameter for a custom logger
   * default: NestJS built-in text-based logger
   * @see https://docs.nestjs.com/techniques/logger
   */
  readonly logger?: LoggerService;
}
```

### MulterExtendedOptions

Key | Default | Description | Example
--- | --- | --- | ---
`dynamicPath` | undefined | The name that you assign to an S3 object
`fileFilter` | Accepts JPEG, PNG types only | Function to control which files are accepted
`limits` | 3MB | Limits of the uploaded data | 5242880 (in bytes)
`resize` | undefined | Resize a single file | { width: 300, height: 350 }
`thumbnail` | undefined | Create a thumbnail image (`object` or `Array<object>`) | { suffix: 'thumbnail', width: 200, height: 200 }

## Support

You could help me out for some coffees 🥤 or give us a star ⭐️

<a href="https://www.buymeacoffee.com/jeffminsungkim" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 150px !important; border-radius: 5px !important;"></a>

## Maintainers

- [Minsung Kim](https://github.com/jeffminsungkim)

&nbsp;

This dynamic module was generated with [Nest Dynamic Package Generator Schematics](https://github.com/nestjsplus/dyn-schematics). You can read more about using the generator [here](https://github.com/nestjsplus/dyn-schematics).

---
