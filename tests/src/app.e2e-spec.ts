import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { uid } from '../fixtures/uid';
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

  it('ImageUploadController /POST without-dynamic-key-path', async () => {
    return request(app.getHttpServer())
      .post(`/image-upload/without-dynamic-key-path`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', path.resolve(__dirname, 'images/smile.jpg'))
      .expect(201)
      .expect(({ body }) => body.key === `${process.env.AWS_S3_APP_NAME}/smile.jpg`);
  });

  it('ImageUploadController /POST with-dynamic-key-path', async () => {
    return request(app.getHttpServer())
      .post(`/image-upload/with-dynamic-key-path`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', path.resolve(__dirname, 'images/smile.jpg'))
      .expect(201)
      .expect(({ body }) => body.key === `${process.env.AWS_S3_APP_NAME}/${uid}/smile.jpg`);
  });

  it('UserProfileImageUploadController /POST without-dynamic-key-path', async () => {
    return request(app.getHttpServer())
      .post(`/user-profile-image-upload/without-dynamic-key-path`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', path.resolve(__dirname, 'images/crying.jpg'))
      .expect(201)
      .expect(({ body }) => body.key === `${process.env.AWS_S3_APP_NAME}/crying.jpg`);
  });

  it('UserProfileImageUploadController /POST with-dynamic-key-path', async () => {
    return request(app.getHttpServer())
      .post(`/user-profile-image-upload/with-dynamic-key-path`)
      .set('Content-Type', 'multipart/form-data')
      .attach('file', path.resolve(__dirname, 'images/crying.jpg'))
      .expect(201)
      .expect(({ body }) => body.key === `${process.env.AWS_S3_APP_NAME}/${uid}/crying.jpg`);
  });
});
