declare module 'hello-color' {
  export default function hello (
    hex: string,
    options?: {
      saturation?: number;
      contrast?: number;
      hues?: number;
      lightness?: number;
    }
  ): { base: ColorHexString; color: ColorHexString; contrast: number; isDark: boolean; scale: Array<ColorHexString>, hues: Array<unknown> };
}

type ColorHexString = string
