import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Try configuring Cloudinary if environment variables are provided
const hasCloudinary = 
  !!process.env.CLOUDINARY_CLOUD_NAME && 
  !!process.env.CLOUDINARY_API_KEY && 
  !!process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("☁️ Cloudinary is configured successfully.");
} else {
  console.log("ℹ️ Cloudinary credentials not configured in environment. Custom uploaded images will be stored as base64 string fallback, which works perfectly!");
}

// Category-based high-quality stock photo map fallback
const CATEGORY_STOCK_PHOTOS = {
  Coding: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
  Lifestyle: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1000",
  Cooking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000",
  Travel: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000",
  Technology: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
  Health: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=1000",
  Education: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000",
  Fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
};

/**
 * Uploads an image either to Cloudinary or falls back to Base64 or elegant Unsplash stock image
 * @param imageSource Base64 string or file buffer source
 * @param category Category of the blog post to map to fallback stock images if empty/unconfigured
 */
export async function uploadImage(imageSource, category) {
  // If it's empty, use category fallback
  if (!imageSource || imageSource.trim() === "") {
    return CATEGORY_STOCK_PHOTOS[category] || CATEGORY_STOCK_PHOTOS["Technology"];
  }

  // If Cloudinary is setup
  if (hasCloudinary) {
    try {
      // Base64 needs to be correctly prefixed or sent to cloudinary upload
      const result = await cloudinary.uploader.upload(imageSource, {
        folder: "mern_blogs",
      });
      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed, falling back safely to Base64 encoding.", err);
      return imageSource; // Fallback to base64 string
    }
  }

  // If raw Base64, just return the Base64 string directly
  if (imageSource.startsWith("data:image")) {
    return imageSource;
  }

  // Otherwise, return fallback placeholder URL
  return CATEGORY_STOCK_PHOTOS[category] || CATEGORY_STOCK_PHOTOS["Technology"];
}
