import siteContent from "../data/site-content.json";

export const brand = {
  ...siteContent.brand,
  awards: siteContent.awards,
  socialLinks: siteContent.socialLinks,
};

export const navLinks = siteContent.navLinks;
export const homeContent = siteContent.home;
export const heritageContent = siteContent.heritage;
export const eventsContent = siteContent.events;
export const newsContent = siteContent.news;
export const products = siteContent.products;

export const productDetailsBySlug = Object.fromEntries(
  siteContent.products.map((product) => [product.slug, product])
);

export function getProductDetails(slug) {
  return productDetailsBySlug[slug] ?? null;
}
