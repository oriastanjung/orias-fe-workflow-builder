export interface ColorPalette {
  colorName: string;
  hexCode: string;
}

export interface BrandGuideline {
  id: string;
  brandName: string;
  description: string;
  productType: string;
  toneOfVoice: string;
  colors: ColorPalette[];
  logoUrl?: string;
  assetsImagesUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandGuidelineFormData {
  brandName: string;
  description: string;
  productType: string;
  toneOfVoice: string;
  colors: ColorPalette[];
  logoFile: File | string | null | undefined;
  assetsImagesFile: (File | string)[];
}
