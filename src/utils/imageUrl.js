import { BASE_URL } from '../services/config';
const getBaseUrl = () => BASE_URL;
/**
 * Returns a full image URL for a given image path/filename.
 * Handles: full URLs, relative filenames, null/undefined.
 */
export const imgUrl = (image) => {
  if (typeof image !== "string" || image.trim() === "") return undefined;
  if (image.startsWith("http")) return image;
  return `${getBaseUrl()}/uploads/${image}`;
};

// Export base URL for direct use
export const API_BASE_URL = getBaseUrl();
