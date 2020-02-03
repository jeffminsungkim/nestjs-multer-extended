import { ResizeOptions, Sharp } from 'sharp';

type SharpOption<T = string> = T;

export type ResizeOption = SharpOption<Size> | SharpOption<Size & ExtendSize>[];

export interface Size {
  width?: number;
  height?: number;
  options?: ResizeOptions;
}

export interface ExtendSize {
  suffix: string;
  Body?: NodeJS.ReadableStream & Sharp;
}

export interface SharpOptions {
  resize?: ResizeOption;
  resizeMultiple?: ResizeOption;
  ignoreAspectRatio?: boolean;
}
