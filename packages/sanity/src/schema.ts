import { faqItem, linkItem, seoFields, specificationItem } from "./schema-types/shared";
import { postType } from "./schema-types/post";
import { productType } from "./schema-types/product";
import { productCategoryType } from "./schema-types/product-category";
import { siteSettingsType } from "./schema-types/site-settings";

export const schemaTypes = [
  seoFields,
  faqItem,
  linkItem,
  specificationItem,
  postType,
  productType,
  productCategoryType,
  siteSettingsType,
];
