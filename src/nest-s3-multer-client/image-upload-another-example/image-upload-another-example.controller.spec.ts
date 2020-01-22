import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadAnotherExampleController } from './image-upload-another-example.controller';

describe('ImageUploadAnotherExample Controller', () => {
  let controller: ImageUploadAnotherExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageUploadAnotherExampleController],
    }).compile();

    controller = module.get<ImageUploadAnotherExampleController>(ImageUploadAnotherExampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
