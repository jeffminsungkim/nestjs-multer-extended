import { ResizeOptions, Sharp } from 'sharp';

type SharpOption<T = string> = T;

interface Size {
  width?: number;
  height?: number;
  options?: ResizeOptions;
}

interface ExtendSize {
  suffix: string;
  Body?: NodeJS.ReadableStream & Sharp;
}

export type ResizeOption = SharpOption<Size> | SharpOption<Size & ExtendSize>[];
export interface SharpOptions {
  resize?: ResizeOption;
  ignoreAspectRatio?: boolean;
}
