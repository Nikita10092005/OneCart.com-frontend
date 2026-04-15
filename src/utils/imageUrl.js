const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Returns a full image URL for a given image path/filename.
 * Handles: full URLs, relative filenames, null/undefined.
 */
export const imgUrl = (image) => {
  if (!image || image.trim() === "") return null;
  if (image.startsWith("http")) return image;
  return `${API_URL}/uploads/${image}`;
};
