<h1 align="center">
<div align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="./media/header-light-theme.png" width="600" alt="NestJS Multer Extended Logo" />
  </a>
</div>
</h1>

<div align="center">
  <a href="https://www.npmjs.com/package/nestjs-multer-extended">
    <img src="https://img.shields.io/npm/v/nestjs-multer-extended.svg" alt="NPM Version" />
  </a>
  <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/jeffminsungkim/nestjs-multer-extended.svg" alt="license" />
  </a>
  <a href="https://circleci.com/gh/jeffminsungkim/nestjs-multer-extended" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/jeffminsungkim/nestjs-multer-extended/master" alt="CircleCI" />
  </a>
  <a href='https://coveralls.io/github/jeffminsungkim/nestjs-multer-extended?branch=master'>
    <img src='https://coveralls.io/repos/github/jeffminsungkim/nestjs-multer-extended/badge.svg?branch=master&service=github' alt='Coverage Status' />
  </a>
  <a href="https://nestjs.com" target="_blank">
    <img src="https://img.shields.io/badge/built%20with-NestJs-e0234e.svg" alt="Built with NestJS" />
  </a>
  <a href="https://github.com/nestjsplus/dyn-schematics" target="_blank">
    <img src="https://img.shields.io/badge/Built%20with-%40nestjsplus%2Fdyn--schematics-brightgreen" alt="Built with @nestjsplus/dyn-schematics" />
  </a>
  <a href="http://commitizen.github.io/cz-cli/" target="_blank">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen"/>
  </a>
  <a href="https://github.com/juliandavidmr/awesome-nestjs#components--libraries">
    <img src="https://awesome.re/mentioned-badge.svg" alt="Awesome Nest" />
  </a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" />
</div>

## Features

- Single file upload to an Amazon S3 bucket
- Support for dynamic paths, upload files wherever you want!
- Generate thumbnail image along with the original
- Resize single image or even make it into different sizes
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
      awsConfig: {
        accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_AWS_ACCESS_KEY_ID',
        region: 'AWS_REGION_NEAR_TO_YOU',
        // ... any options you want to pass to the AWS instance
      },
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

```javascript
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

```javascript
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

Route parameters can also be used as a key. For example, if you have the route `/user/:name`, then pass the `name` into the `dynamicPath` property as a value.

```javascript
@Post('user/:name')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    dynamicPath: 'name'
  }),
)
uploadFile(@UploadedFile() file) {
  // POST /user/jeffminsungkim
  console.log(file);
  // => YOUR-BASE-PATH/jeffminsungkim/filename.png
}

@Post('user/:name/team/:no')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    dynamicPath: 'no'
  }),
)
uploadFile(@UploadedFile() file) {
  // POST /user/jeffminsungkim/team/8987
  console.log(file);
  // => YOUR-BASE-PATH/8987/filename.png
}

@Post('user/:name/team/:no')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    dynamicPath: ['name', 'no']
  }),
)
uploadFile(@UploadedFile() file) {
  // POST /user/jeffminsungkim/team/8987
  console.log(file);
  // => YOUR-BASE-PATH/jeffminsungkim/8987/filename.png
}
```

&nbsp;

You may want to store the file with an arbitrary name instead of the original file name. You can do this by passing the `randomFilename` property attribute set to `true` as follows:

```javascript
@Post('upload')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    randomFilename: true
  }),
)
uploadFile(@UploadedFile() file) {
  console.log(file);
}
```

If you want to resize the file before the upload, you can pass on the `resize` property as follows:

```javascript
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

You can pass an array of size options to resize a single image into different sizes as follows:

```javascript
@Post('upload')
@UseInterceptors(
  AmazonS3FileInterceptor('file', {
    resizeMultiple: [
      { suffix: 'sm', width: 200, height: 200 },
      { suffix: 'md', width: 300, height: 300 },
      { suffix: 'lg', width: 400, height: 400 },
    ],
  }
)
uploadFile(@UploadedFile() file) {
  console.log(file);
}
```

Not only creating a thumbnail image but also willing to change the file size limit, you can pass the properties as follows:

```javascript
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
   * @deprecated v2 use awsConfig instead
   */
  readonly accessKeyId?: string;
  /**
   * AWS Secret Access Key
   * @deprecated v2 use awsConfig instead
   */
  readonly secretAccessKey?: string;
  /**
   * Default region name
   * default: us-west-2
   * @deprecated v2 use awsConfig instead
   */
  readonly region?: string;
  /**
   * AWS Config
   */
  readonly awsConfig?: ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions & {[key: string]: any};
  /**
   * S3 Config
   */
  readonly s3Config?: AWS.S3.Types.ClientConfiguration;
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
   * AWS Endpoint
   * @deprecated v2 use s3Config instead
   */
  readonly endpoint?: string;
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
`dynamicPath` | undefined | The name that you assign to an S3 object | "aec16138-a75a-4961-b8c1-8e803b6bf2cf/random/dir"
`randomFilename` | undefined | If this property sets to true, a random file name will be generated | "aec16138-a75a-4961-b8c1-8e803b6bf2cf"
`fileFilter` | Accepts JPEG, PNG types only | Function to control which files are accepted
`limits` | 3MB | Limits of the uploaded data | 5242880 (in bytes)
`resize` | undefined | Resize a single file | { width: 300, height: 350 }
`resizeMultiple` | undefined | Resize a single file into different sizes (`Array<object>`) | [{ suffix: 'md', width: 300, height: 350 }, { suffix: 'sm', width: 200, height: 200 }]
`thumbnail` | undefined | Create a thumbnail image (`object`) | { suffix: 'thumbnail', width: 200, height: 200 }

## Support

<a href="https://www.buymeacoffee.com/jeffminsungkim" target="_blank">
  <img src="https://badgen.net/badge/Buy%20Me/A%20Coffee/orange?icon=kofi" alt="Buymeacoffee" />
</a>

You could help me out for some coffees 🥤 or give us a star ⭐️

## Maintainers

- [Minsung Kim](https://github.com/jeffminsungkim)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeffminsungkim.com"><img src="https://avatars1.githubusercontent.com/u/6092023?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Minsung Kim</b></sub></a><br /><a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=jeffminsungkim" title="Code">💻</a> <a href="#maintenance-jeffminsungkim" title="Maintenance">🚧</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=jeffminsungkim" title="Documentation">📖</a> <a href="#infra-jeffminsungkim" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#ideas-jeffminsungkim" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=jeffminsungkim" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jmcdo29"><img src="https://avatars3.githubusercontent.com/u/28268680?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jay McDoniel</b></sub></a><br /><a href="#ideas-jmcdo29" title="Ideas, Planning, & Feedback">🤔</a> <a href="#tool-jmcdo29" title="Tools">🔧</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/pulls?q=is%3Apr+reviewed-by%3Ajmcdo29" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=jmcdo29" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/semin3276"><img src="https://avatars1.githubusercontent.com/u/60590414?v=4?s=100" width="100px;" alt=""/><br /><sub><b>semin3276</b></sub></a><br /><a href="#design-semin3276" title="Design">🎨</a></td>
    <td align="center"><a href="https://www.rene-volbach.de"><img src="https://avatars0.githubusercontent.com/u/18092644?v=4?s=100" width="100px;" alt=""/><br /><sub><b>René Volbach</b></sub></a><br /><a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=volbrene" title="Code">💻</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=volbrene" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://grainer.io"><img src="https://avatars0.githubusercontent.com/u/14952013?v=4?s=100" width="100px;" alt=""/><br /><sub><b>gimyboya</b></sub></a><br /><a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=gimyboya" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dineshsalunke"><img src="https://avatars2.githubusercontent.com/u/52815633?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dineshsalunke</b></sub></a><br /><a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=dineshsalunke" title="Code">💻</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=dineshsalunke" title="Documentation">📖</a></td>
    <td align="center"><a href="http://michaelwolz.de"><img src="https://avatars3.githubusercontent.com/u/7479806?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Wolz</b></sub></a><br /><a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=michaelwolz" title="Code">💻</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=michaelwolz" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://visurel.com"><img src="https://avatars3.githubusercontent.com/u/7209649?v=4?s=100" width="100px;" alt=""/><br /><sub><b>visurel</b></sub></a><br /><a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=visurel" title="Code">💻</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=visurel" title="Documentation">📖</a></td>
    <td align="center"><a href="http://tevpro.com"><img src="https://avatars.githubusercontent.com/u/1214744?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Keith Kikta</b></sub></a><br /><a href="#maintenance-newbish" title="Maintenance">🚧</a> <a href="https://github.com/jeffminsungkim/nestjs-multer-extended/commits?author=newbish" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
