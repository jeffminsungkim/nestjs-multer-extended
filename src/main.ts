/**
 *  If you're building a standalone npm package hosting a dynamic module, you
 *  should delete this file.  Its only purpose is to bootstrap the app so that
 *  you can run the quick verification test (see nest-s3-multer-client/nest-s3-multer-client.module.ts)
 */
import { NestFactory } from '@nestjs/core';
import { NestS3MulterClientModule } from './nest-s3-multer-client/nest-s3-multer-client.module';

async function bootstrap() {
  const app = await NestFactory.create(NestS3MulterClientModule);
  await app.listen(3000);
}
bootstrap();
