import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export type ResizeOptions = {
  width: number;
  height: number;
};

export interface PreciseSizeOptions extends ResizeOptions {
  suffix: string;
}

export interface MulterExtendedOptions extends Pick<MulterOptions, 'fileFilter' | 'limits'> {
  resize?: ResizeOptions;
  thumbnail?: PreciseSizeOptions | PreciseSizeOptions[];
}
