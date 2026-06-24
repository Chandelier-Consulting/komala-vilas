export type AssetStatus = "active" | "archived";
export type ImageAssetKind = "default" | "uploaded";

export type ImageAsset = {
  id: string;
  label: string;
  alt: string;
  kind: ImageAssetKind;
  src: string;
  width: number;
  height: number;
  status: AssetStatus;
  storagePath?: string;
  contentType?: string;
  sizeBytes?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ResolvedImage = {
  assetId: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type MenuItemOverride = {
  itemId?: string;
  sectionId?: string;
  name?: string;
  description?: string;
  price?: string;
  tags?: string[];
  popular?: boolean;
  cateringFriendly?: boolean;
  imageAssetId?: string | null;
  updatedAt?: string;
};

export type SitePhotoAssignment = {
  assetId: string;
  updatedAt?: string;
};

export function resolveImageAsset(
  fallback: ResolvedImage,
  imageAssetId: string | null | undefined,
  assets: Record<string, ImageAsset>,
) {
  if (!imageAssetId) return fallback;
  const asset = assets[imageAssetId];
  if (!asset || asset.status !== "active") return fallback;

  return {
    assetId: asset.id,
    src: asset.src,
    alt: asset.alt || fallback.alt,
    width: asset.width || fallback.width,
    height: asset.height || fallback.height,
  };
}
