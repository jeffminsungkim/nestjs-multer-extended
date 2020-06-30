import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface ResizeOptions {
  width: number;
  height: number;
}

export interface MultipleSizeOptions {
  suffix: string;
  width?: number;
  height?: number;
}

export interface MulterExtendedOptions extends Pick<MulterOptions, 'fileFilter' | 'limits'> {
  dynamicPath?: string | string[];
  randomFilename?: boolean;
  resize?: ResizeOptions;
  resizeMultiple?: MultipleSizeOptions[];
  thumbnail?: MultipleSizeOptions;
}
