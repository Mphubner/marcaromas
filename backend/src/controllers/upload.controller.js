import path from "path";
import fs from "fs";
import sharp from "sharp";
import { supabase, STORAGE_BUCKET } from "../lib/supabase.js";

const UPLOADS_DIR = path.resolve("./uploads");

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Quality settings by image type
const QUALITY_SETTINGS = {
  product: 90,    // High quality for product images
  banner: 85,     // Good quality for banners
  avatar: 80,     // Standard quality for avatars
  default: 85     // Default quality
};

// Max dimensions by image type
const MAX_DIMENSIONS = {
  product: { width: 2000, height: 2000 },
  banner: { width: 1920, height: 1080 },
  avatar: { width: 800, height: 800 },
  default: { width: 2000, height: 2000 }
};

// Thumbnail size
const THUMBNAIL_SIZE = 400;
const MEDIUM_PERCENTAGE = 0.5; // 50% of original

/**
 * Save file to local filesystem
 */
/**
 * Save file to local filesystem
 */
export async function saveFileLocal(buffer, filename, subDir = '') {
  const targetDir = subDir ? path.join(UPLOADS_DIR, subDir) : UPLOADS_DIR;

  // Ensure target dir exists
  if (!fs.existsSync(targetDir)) {
    await fs.promises.mkdir(targetDir, { recursive: true });
  }

  const filePath = path.join(targetDir, filename);
  await fs.promises.writeFile(filePath, buffer);
  return filePath;
}

/**
 * Upload file to Supabase Storage
 */
async function uploadToSupabase(buffer, filename, contentType = 'image/webp') {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, {
      contentType,
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

/**
 * Validate image file
 */
function validateImage(file) {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
  }

  if (file.size > maxSizeBytes) {
    throw new Error(`File too large. Maximum size: ${maxSizeBytes / 1024 / 1024}MB`);
  }
}

/**
 * Process and save image with multiple sizes
 * @param {Object} file - Multer file object
 * @param {Object} options - { imageType: 'product'|'banner'|'avatar', quality: number }
 */
export async function processAndSaveImage(file, options = {}) {
  // Validate file
  validateImage(file);

  const { originalname, buffer, mimetype } = file;
  const ext = path.extname(originalname).toLowerCase() || ".jpg";
  const basename = path.basename(originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
  const timestamp = Date.now();

  // Get settings based on image type
  const imageType = options.imageType || 'default';
  const quality = options.quality ?? QUALITY_SETTINGS[imageType];
  const maxDims = MAX_DIMENSIONS[imageType];

  // Get original image metadata
  const metadata = await sharp(buffer).metadata();

  // Calculate dimensions respecting aspect ratio
  let resizeOptions = {};
  if (metadata.width > maxDims.width || metadata.height > maxDims.height) {
    resizeOptions = {
      width: maxDims.width,
      height: maxDims.height,
      fit: 'inside',
      withoutEnlargement: true
    };
  }

  // Generate filenames
  const webpName = `${basename}_${timestamp}.webp`;
  const jpegName = `${basename}_${timestamp}.jpg`;
  const mediumWebpName = `${basename}_${timestamp}_medium.webp`;
  const thumbnailWebpName = `${basename}_${timestamp}_thumb.webp`;

  // Process original size - WebP
  const webpBuffer = await sharp(buffer)
    .rotate() // Auto-rotate based on EXIF
    .resize(resizeOptions)
    .webp({ quality })
    .toBuffer();

  // Process original size - JPEG fallback
  const jpegBuffer = await sharp(buffer)
    .rotate()
    .resize(resizeOptions)
    .jpeg({ quality })
    .toBuffer();

  // Get resized dimensions for calculating medium size
  const resizedMetadata = await sharp(webpBuffer).metadata();

  // Process medium size (50% of resized)
  const mediumWidth = Math.round(resizedMetadata.width * MEDIUM_PERCENTAGE);
  const mediumBuffer = await sharp(buffer)
    .rotate()
    .resize({ width: mediumWidth, withoutEnlargement: true })
    .webp({ quality: quality - 5 }) // Slightly lower quality for medium
    .toBuffer();

  // Process thumbnail (square crop)
  const thumbnailBuffer = await sharp(buffer)
    .rotate()
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 80 })
    .toBuffer();

  // Determine subdirectory based on image type
  const subDir = imageType === 'content' ? 'content/' : '';

  // Upload to Supabase Storage (or local as fallback)
  let webpUrl, jpgUrl, mediumUrl, thumbnailUrl;

  try {
    if (supabase) {
      // Upload to Supabase Storage
      webpUrl = await uploadToSupabase(webpBuffer, `${subDir}${webpName}`, 'image/webp');
      jpgUrl = await uploadToSupabase(jpegBuffer, `${subDir}${jpegName}`, 'image/jpeg');
      mediumUrl = await uploadToSupabase(mediumBuffer, `${subDir}${mediumWebpName}`, 'image/webp');
      thumbnailUrl = await uploadToSupabase(thumbnailBuffer, `${subDir}${thumbnailWebpName}`, 'image/webp');
    } else {
      // Fallback to local storage
      const webpPath = await saveFileLocal(webpBuffer, webpName, subDir.replace('/', ''));
      const jpegPath = await saveFileLocal(jpegBuffer, jpegName, subDir.replace('/', ''));
      const mediumPath = await saveFileLocal(mediumBuffer, mediumWebpName, subDir.replace('/', ''));
      const thumbnailPath = await saveFileLocal(thumbnailBuffer, thumbnailWebpName, subDir.replace('/', ''));

      const urlPrefix = `/uploads/${subDir}`;
      webpUrl = `${urlPrefix}${path.basename(webpPath)}`;
      jpgUrl = `${urlPrefix}${path.basename(jpegPath)}`;
      mediumUrl = `${urlPrefix}${path.basename(mediumPath)}`;
      thumbnailUrl = `${urlPrefix}${path.basename(thumbnailPath)}`;
    }
  } catch (error) {
    console.error('Error uploading to Supabase, falling back to local:', error);
    // Fallback to local storage on error
    const webpPath = await saveFileLocal(webpBuffer, webpName, subDir.replace('/', ''));
    const jpegPath = await saveFileLocal(jpegBuffer, jpegName, subDir.replace('/', ''));
    const mediumPath = await saveFileLocal(mediumBuffer, mediumWebpName, subDir.replace('/', ''));
    const thumbnailPath = await saveFileLocal(thumbnailBuffer, thumbnailWebpName, subDir.replace('/', ''));

    const urlPrefix = `/uploads/${subDir}`;
    webpUrl = `${urlPrefix}${path.basename(webpPath)}`;
    jpgUrl = `${urlPrefix}${path.basename(jpegPath)}`;
    mediumUrl = `${urlPrefix}${path.basename(mediumPath)}`;
    thumbnailUrl = `${urlPrefix}${path.basename(thumbnailPath)}`;
  }

  return {
    originalName: originalname,
    mimeType: mimetype,
    imageType,
    quality,
    dimensions: {
      original: {
        width: metadata.width,
        height: metadata.height
      },
      resized: {
        width: resizedMetadata.width,
        height: resizedMetadata.height
      }
    },
    files: {
      webp: webpUrl,
      jpg: jpgUrl,
      medium: mediumUrl,
      thumbnail: thumbnailUrl,
    },
  };
}

/**
 * Upload single file endpoint
 */
export default {
  uploadSingle: async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file provided" });

      // Get image type from query or body (product, banner, avatar)
      const imageType = req.query.type || req.body.imageType || 'default';

      const meta = await processAndSaveImage(req.file, { imageType });

      // Return URL for backward compatibility
      res.json({
        ok: true,
        url: meta.files.webp, // Use WebP as default
        meta
      });
    } catch (err) {
      if (err.message.includes('Invalid file type') || err.message.includes('File too large')) {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  },

  deleteFile: async (req, res, next) => {
    try {
      const { filename } = req.params;
      if (!filename) return res.status(400).json({ error: 'filename required' });

      const safe = path.basename(filename);
      const mainFile = path.join(UPLOADS_DIR, safe);

      if (!fs.existsSync(mainFile)) {
        return res.status(404).json({ error: 'file not found' });
      }

      // Delete main file
      await fs.promises.unlink(mainFile);

      // Try to delete related files (medium, thumbnail, and different formats)
      const baseNameMatch = safe.match(/^(.+?)(_\d+)(\.\w+)$/);
      if (baseNameMatch) {
        const [, baseName, timestamp] = baseNameMatch;
        const relatedFiles = [
          `${baseName}${timestamp}.webp`,
          `${baseName}${timestamp}.jpg`,
          `${baseName}${timestamp}_medium.webp`,
          `${baseName}${timestamp}_thumb.webp`,
        ];

        for (const relatedFile of relatedFiles) {
          const relatedPath = path.join(UPLOADS_DIR, relatedFile);
          if (fs.existsSync(relatedPath) && relatedPath !== mainFile) {
            try {
              await fs.promises.unlink(relatedPath);
            } catch (err) {
              // Ignore errors on cleanup
            }
          }
        }
      }

      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
};

