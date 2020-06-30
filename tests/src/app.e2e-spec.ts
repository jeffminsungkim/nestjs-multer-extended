import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { MulterExceptions } from '../../lib/multer-sharp/enums';
import { uid } from '../fixtures/uid';
import {
  IMAGE_UPLOAD_MODULE_BASE_PATH,
  USER_PROFILE_IMAGE_UPLOAD_MODULE_BASE_PATH,
} from '../fixtures/base-path.constants';

import path from 'path';
import request from 'supertest';

describe('AppModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ImageUploadController /POST', () => {
    const basePath = `${IMAGE_UPLOAD_MODULE_BASE_PATH}`;
    const dynamicPath = `${IMAGE_UPLOAD_MODULE_BASE_PATH}/${uid}`;

    it(`should upload an image under the base path "${basePath}"`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/without-dynamic-key-path`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/smile.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`${basePath}/smile.jpg`);
    });

    it(`should upload an image under the dynamic path "${dynamicPath}"`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/with-dynamic-key-path`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/smile.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`${dynamicPath}/smile.jpg`);
    });

    it(`should upload an image with random filename`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/with-random-filename`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/smile.jpg'));

      expect(res.status).toEqual(201);
    });

    it(`should not upload non image format`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/non-image-file`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/Readme.md'));

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual(MulterExceptions.INVALID_IMAGE_FILE_TYPE);
    });

    it(`should upload non image format if the file filter is missing`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/non-image-file-no-filter`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/Readme.md'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`${basePath}/Readme.md`);
    });

    it(`should not upload an image when its size exceed the limit`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/big-size-file`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/cat.jpg'));

      expect(res.status).toEqual(413);
      expect(res.body.message).toEqual(MulterExceptions.LIMIT_FILE_SIZE);
    });

    it(`should upload an image when the size limit option sets higher than the file size`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/big-size-file-higher-limit`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/cat.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`${basePath}/cat.jpg`);
    });
  });

  describe('UserProfileImageUploadController /POST', () => {
    const basePath = `${USER_PROFILE_IMAGE_UPLOAD_MODULE_BASE_PATH}`;
    const dynamicPath = `${USER_PROFILE_IMAGE_UPLOAD_MODULE_BASE_PATH}/${uid}`;

    it(`should upload an image under the base path "${basePath}"`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/without-dynamic-key-path`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/crying.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`${basePath}/crying.jpg`);
    });

    it(`should upload an image under the dynamic path "${dynamicPath}"`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/with-dynamic-key-path`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/crying.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`${dynamicPath}/crying.jpg`);
    });

    it(`should upload an image under the first path parameter :key(abcd1234)`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/use-path-param-as-a-key/abcd1234`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/crying.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`user-profile-image-upload-module/abcd1234/crying.jpg`);
    });

    it(`should upload an image under :key(abcd1234)/:id(msk)`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/use-path-param-as-a-key/abcd1234/user/msk`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/crying.jpg'));

      expect(res.status).toEqual(201);
      expect(res.body.key).toEqual(`user-profile-image-upload-module/abcd1234/msk/crying.jpg`);
    });

    it(`should upload both an original and a thumbnail image`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/create-thumbnail-with-custom-options`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/crying.jpg'));
      const { thumbnail, original } = res.body;

      expect(res.status).toEqual(201);
      expect(thumbnail.width).toEqual(250);
      expect(thumbnail.height).toEqual(250);
      expect(thumbnail.key).toEqual(`${basePath}/crying.jpg-thumbnail`);
      expect(original.key).toEqual(`${basePath}/crying.jpg-original`);
    });

    it(`should upload thumb and original under the dynamic path "${dynamicPath}/test"`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/create-thumbnail-with-dynamic-key`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/crying.jpg'));
      const { thumb, original } = res.body;

      expect(res.status).toEqual(201);
      expect(thumb.width).toEqual(200);
      expect(thumb.height).toEqual(200);
      expect(thumb.key).toEqual(`${dynamicPath}/test/crying.jpg-thumb`);
      expect(original.key).toEqual(`${dynamicPath}/test/crying.jpg-original`);
    });

    it(`should upload resized image`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/resized`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/go.jpeg'));

      expect(res.status).toEqual(201);
      expect(res.body.width).toEqual(500);
      expect(res.body.height).toEqual(450);
      expect(res.body.key).toEqual(`${basePath}/go.jpeg`);
    });

    it(`should upload images in different sizes`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/user-profile-image-upload/different-sizes`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/cat.jpg'));
      const { sm, md, lg } = res.body;

      expect(res.status).toEqual(201);
      expect(sm.width).toEqual(200);
      expect(sm.height).toEqual(200);
      expect(md.height).toEqual(300);
      expect(md.height).toEqual(300);
      expect(lg.height).toEqual(400);
      expect(lg.height).toEqual(400);
      expect(sm.key).toEqual(`${dynamicPath}/different-sizes/cat.jpg-sm`);
      expect(md.key).toEqual(`${dynamicPath}/different-sizes/cat.jpg-md`);
      expect(lg.key).toEqual(`${dynamicPath}/different-sizes/cat.jpg-lg`);
    });
  });
});
