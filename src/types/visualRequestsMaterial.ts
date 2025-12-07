export const VisualRequestsMaterialCategoryType = {
  IN_STORE_MEDIA: "IN_STORE_MEDIA",
  IN_STORE_DIGITAL_MEDIA: "IN_STORE_DIGITAL_MEDIA",
  OFFLINE_BRAND_EXPERIENCE: "OFFLINE_BRAND_EXPERIENCE",
  ONLINE_BRAND_EXPERIENCE: "ONLINE_BRAND_EXPERIENCE",
  END_TO_END_CREATIVE_PRODUCTION: "END_TO_END_CREATIVE_PRODUCTION",
  INTEGRATED_CAMPAIGNS: "INTEGRATED_CAMPAIGNS",
} as const;

export type VisualRequestsMaterialCategoryType =
  (typeof VisualRequestsMaterialCategoryType)[keyof typeof VisualRequestsMaterialCategoryType];

export interface VisualRequestsMaterial {
  id: string;
  categoryType: VisualRequestsMaterialCategoryType;
  subCategory: string;
  description: string;
  promptToGenerate: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  position: string;
  material: string;
  storeLocation: string;
  mockupAssetsReference: string[];
  baseMockupAsset: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisualRequestsMaterialInput {
  categoryType: VisualRequestsMaterialCategoryType;
  subCategory: string;
  description: string;
  promptToGenerate: string;
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  position: string;
  material: string;
  storeLocation: string;
  baseMockupAsset: File | null;
  mockupAssetsReference: File[];
}

export interface UpdateVisualRequestsMaterialInput
  extends Partial<CreateVisualRequestsMaterialInput> {
  id: string;
  existingBaseMockupAsset?: string;
  existingMockupAssetsReference?: string[];
}
