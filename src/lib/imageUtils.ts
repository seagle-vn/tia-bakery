import { cld } from '@/constants/cloudinary';
import { scale } from '@cloudinary/url-gen/actions/resize';

/**
 * Get an optimized image URL from Cloudinary with specified dimensions
 * @param publicId - The Cloudinary public ID of the image
 * @param width - Desired width in pixels
 * @param height - Desired height in pixels (optional, maintains aspect ratio if not provided)
 * @returns Optimized image URL
 */
export function getOptimizedImage(
  publicId: string,
  width: number,
  height?: number
): string {
  if (!publicId) {
    return '';
  }

  const image = cld.image(publicId).quality('auto').format('auto');

  if (height) {
    image.resize(scale().width(width).height(height));
  } else {
    image.resize(scale().width(width));
  }

  return image.toURL();
}

/**
 * Get a responsive srcset for an image with 1x and 2x variants
 * @param publicId - The Cloudinary public ID of the image
 * @param width - Base width in pixels
 * @param height - Base height in pixels (optional)
 * @returns srcset string for responsive images
 */
export function getResponsiveSrcSet(
  publicId: string,
  width: number,
  height?: number
): string {
  const src1x = getOptimizedImage(publicId, width, height);
  const src2x = getOptimizedImage(publicId, width * 2, height ? height * 2 : undefined);

  return `${src1x} 1x, ${src2x} 2x`;
}

/**
 * Extract image dimensions from aspect ratio and width
 * @param aspectRatio - Aspect ratio (e.g., "16:10", "1:1", "4:5")
 * @param width - Width in pixels
 * @returns Object with width and height
 */
export function getDimensionsFromAspectRatio(
  aspectRatio: string,
  width: number
): { width: number; height: number } {
  const [w, h] = aspectRatio.split(':').map(Number);
  const height = Math.round((width * h) / w);

  return { width, height };
}

/**
 * Common image sizes for the application
 */
export const IMAGE_SIZES = {
  // Hero images
  hero: {
    desktop: { width: 1920, height: 900 },
    mobile: { width: 800, height: 600 },
  },
  // Product cards
  productCard: {
    signature: { width: 672, height: 420 }, // 16:10 ratio, 2x for retina
    treat: { width: 460, height: 460 }, // 1:1 ratio, 2x for retina
  },
  // Gallery images
  gallery: { width: 460, height: 460 }, // 1:1 ratio, 2x for retina
  // Cart images
  cart: { width: 240, height: 240 }, // 2x for retina
  // Thumbnails
  thumbnail: { width: 120, height: 120 },
} as const;
