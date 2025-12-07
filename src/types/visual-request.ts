export interface VisualRequestHistory {
  status: string;
  date: string;
}

export interface VisualRequestMaterialVariantDetail {
  channel: string;
  objective: string;
  size: string;
  material: string;
  location: string;
}

export interface VisualRequestMaterialVariant {
  variantImageUrl: string;
  detail: VisualRequestMaterialVariantDetail;
}

export interface VisualRequestMaterialComment {
  userId: string;
  text: string;
  status: string;
  date: string;
}

export interface VisualRequestMaterial {
  materialId: string;
  baseAssetUrl: string;
  productName: string;
  variants: VisualRequestMaterialVariant[];
  state: string;
  comments: VisualRequestMaterialComment[];
}

export interface VisualRequestBrandGuideline {
  id: string;
  userId: string;
  brandName: string;
  description: string;
  productType: string;
  toneOfVoice: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colors: any;
  logoUrl?: string | null;
  assetsImagesUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VisualRequestsMaterial {
  id: string;
  categoryType: string;
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

export interface VisualRequest {
  id: string;
  userId: string;
  brandName: string;
  websiteBrand: string;
  goals: string;
  brandGuidelineId: string;
  brandGuideline?: VisualRequestBrandGuideline;
  history: VisualRequestHistory[];
  state: string;
  sharedLinkUrl?: string | null;
  materials: VisualRequestMaterial[];
  createdAt: string;
  updatedAt: string;
}
