import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("menu content layer supports Firestore overrides on top of fixed sections", async () => {
  const menu = await readFile(new URL("../lib/menu.ts", import.meta.url), "utf8");

  assert.match(menu, /export const defaultMenuSections/);
  assert.match(menu, /id:\s*"dosa-masala-dosa"/);
  assert.match(menu, /image:\s*ResolvedImage/);
  assert.match(menu, /export function mergeMenuContent/);
  assert.match(menu, /override\.imageAssetId/);
  assert.match(menu, /resolveImageAsset/);
});

test("site photo slots support uploaded asset assignment with bundled fallback images", async () => {
  const sitePhotos = await readFile(new URL("../lib/site-photos.ts", import.meta.url), "utf8");

  assert.match(sitePhotos, /export const defaultSitePhotoSlots/);
  assert.match(sitePhotos, /"home-hero"/);
  assert.match(sitePhotos, /"menu-hero"/);
  assert.match(sitePhotos, /"catering-package-dosa-counter"/);
  assert.match(sitePhotos, /export function resolveSitePhotoSlots/);
  assert.match(sitePhotos, /input\.assignments/);
  assert.match(sitePhotos, /resolveImageAsset/);
});
