const RAILWAY_BASE = "https://onecart-backend-production-400c.up.railway.app";

// Get base URL without /api suffix for image uploads
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || (RAILWAY_BASE + "/api");
  return apiUrl.replace(/\/api$/, "");
};

/**
 * Returns a full image URL for a given image path/filename.
 * Handles: full URLs, relative filenames, null/undefined.
 */
export const imgUrl = (image) => {
  if (!image || image.trim() === "") return null;
  if (image.startsWith("http")) return image;
  return `${getBaseUrl()}/uploads/${image}`;
};

// Export base URL for direct use
export const API_BASE_URL = getBaseUrl();
