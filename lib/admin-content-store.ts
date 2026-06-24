import { getAdminDb, getAdminStorage } from "@/lib/firebase-admin";
import { buildAssetMap, defaultMenuSections, mergeMenuContent, type MenuSection } from "@/lib/menu";
import { defaultSitePhotoSlots, resolveSitePhotoSlots, type SitePhotoSlot } from "@/lib/site-photos";
import type { ImageAsset, MenuItemOverride, SitePhotoAssignment } from "@/lib/content";

const MENU_OVERRIDE_COLLECTION = "menuItemOverrides";
const IMAGE_ASSET_COLLECTION = "imageAssets";
const SITE_PHOTO_ASSIGNMENT_COLLECTION = "sitePhotoAssignments";

function getDefaultAssets() {
  return {
    ...buildAssetMap(defaultMenuSections),
    ...Object.fromEntries(
      Object.values(defaultSitePhotoSlots).map((slot) => [
        slot.image.assetId,
        {
          id: slot.image.assetId,
          label: slot.label,
          alt: slot.image.alt,
          kind: "default" as const,
          src: slot.image.src,
          width: slot.image.width,
          height: slot.image.height,
          status: "active" as const,
        },
      ]),
    ),
  };
}

async function readCollectionMap<T extends Record<string, unknown>>(
  collectionName: string,
  mapDoc: (id: string, data: Record<string, unknown>) => T,
) {
  const snapshot = await getAdminDb().collection(collectionName).get();
  return snapshot.docs.reduce<Record<string, T>>((accumulator, doc) => {
    accumulator[doc.id] = mapDoc(doc.id, doc.data());
    return accumulator;
  }, {});
}

async function loadUploadedAssets() {
  try {
    return await readCollectionMap<ImageAsset>(IMAGE_ASSET_COLLECTION, (id, data) => ({
      id,
      label: String(data.label ?? "Uploaded image"),
      alt: String(data.alt ?? data.label ?? "Komala Vilas image"),
      kind: "uploaded",
      src: `/api/assets/${id}`,
      width: Number(data.width ?? 1200),
      height: Number(data.height ?? 900),
      status: data.status === "archived" ? "archived" : "active",
      storagePath: typeof data.storagePath === "string" ? data.storagePath : undefined,
      contentType: typeof data.contentType === "string" ? data.contentType : undefined,
      sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : undefined,
      createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    }));
  } catch {
    return {};
  }
}

async function loadMenuOverrides() {
  try {
    return await readCollectionMap<MenuItemOverride>(MENU_OVERRIDE_COLLECTION, (_id, data) => ({
      itemId: typeof data.itemId === "string" ? data.itemId : undefined,
      sectionId: typeof data.sectionId === "string" ? data.sectionId : undefined,
      name: typeof data.name === "string" ? data.name : undefined,
      description: typeof data.description === "string" ? data.description : undefined,
      price: typeof data.price === "string" ? data.price : undefined,
      tags: Array.isArray(data.tags) ? data.tags.filter((item): item is string => typeof item === "string") : undefined,
      popular: typeof data.popular === "boolean" ? data.popular : undefined,
      cateringFriendly: typeof data.cateringFriendly === "boolean" ? data.cateringFriendly : undefined,
      imageAssetId: typeof data.imageAssetId === "string" ? data.imageAssetId : data.imageAssetId === null ? null : undefined,
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    }));
  } catch {
    return {};
  }
}

async function loadSitePhotoAssignments() {
  try {
    return await readCollectionMap<SitePhotoAssignment>(SITE_PHOTO_ASSIGNMENT_COLLECTION, (_id, data) => ({
      assetId: String(data.assetId ?? ""),
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    }));
  } catch {
    return {};
  }
}

export async function getImageAssetLibrary() {
  return {
    ...getDefaultAssets(),
    ...(await loadUploadedAssets()),
  };
}

export async function getResolvedMenuSections(): Promise<MenuSection[]> {
  const [assets, itemOverrides] = await Promise.all([getImageAssetLibrary(), loadMenuOverrides()]);
  return mergeMenuContent(defaultMenuSections, { assets, itemOverrides });
}

export async function getResolvedSitePhotoSlots(): Promise<Record<string, SitePhotoSlot>> {
  const [assets, assignments] = await Promise.all([getImageAssetLibrary(), loadSitePhotoAssignments()]);
  return resolveSitePhotoSlots(defaultSitePhotoSlots, { assets, assignments });
}

export async function getAdminMenuEditorData() {
  const [assets, sections, overrides] = await Promise.all([
    getImageAssetLibrary(),
    getResolvedMenuSections(),
    loadMenuOverrides(),
  ]);

  return { assets, sections, overrides };
}

export async function getAdminPhotoEditorData() {
  const [assets, slots, assignments] = await Promise.all([
    getImageAssetLibrary(),
    getResolvedSitePhotoSlots(),
    loadSitePhotoAssignments(),
  ]);

  return { assets, slots, assignments };
}

export async function getUploadedImageAsset(assetId: string) {
  const uploadedAssets = await loadUploadedAssets();
  const asset = uploadedAssets[assetId];
  return asset?.kind === "uploaded" ? asset : null;
}

async function getReferencedImageAssetIds() {
  const [menuOverrides, assignments] = await Promise.all([loadMenuOverrides(), loadSitePhotoAssignments()]);
  const referencedAssetIds = new Set<string>();

  for (const override of Object.values(menuOverrides)) {
    if (typeof override.imageAssetId === "string" && override.imageAssetId) {
      referencedAssetIds.add(override.imageAssetId);
    }
  }

  for (const assignment of Object.values(assignments)) {
    if (assignment.assetId) {
      referencedAssetIds.add(assignment.assetId);
    }
  }

  return referencedAssetIds;
}

export async function getUnusedUploadedImageAssets() {
  const [uploadedAssets, referencedAssetIds] = await Promise.all([
    loadUploadedAssets(),
    getReferencedImageAssetIds(),
  ]);

  return Object.values(uploadedAssets).filter(
    (asset) => asset.kind === "uploaded" && !referencedAssetIds.has(asset.id),
  );
}

export async function pruneUnusedUploadedImageAssets() {
  const unusedAssets = await getUnusedUploadedImageAssets();
  const bucket = getAdminStorage().bucket();

  await Promise.all(
    unusedAssets.map(async (asset) => {
      if (asset.storagePath) {
        await bucket.file(asset.storagePath).delete({ ignoreNotFound: true });
      }

      await getAdminDb().collection(IMAGE_ASSET_COLLECTION).doc(asset.id).delete();
    }),
  );

  return {
    deletedAssetIds: unusedAssets.map((asset) => asset.id),
    deletedCount: unusedAssets.length,
  };
}
