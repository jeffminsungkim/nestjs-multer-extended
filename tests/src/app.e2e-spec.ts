import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
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

    it(`should not upload non image format`, async () => {
      const res = await request(app.getHttpServer())
        .post(`/image-upload/non-image-file`)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', path.resolve(__dirname, 'data/Readme.md'));

      expect(res.status).toEqual(400);
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
  });
});
