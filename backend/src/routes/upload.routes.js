import express from "express";
import multer from "multer";
import uploadController from "../controllers/upload.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Use memory storage, process with sharp then persist
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de arquivo não permitido. Aceito: jpeg, png, webp."));
  },
});

// Admin-only upload endpoint
router.post("/", authMiddleware, adminMiddleware, upload.single("file"), uploadController.uploadSingle);

// Content image upload (specific field name 'image' and type 'content')
router.post("/content-image", authMiddleware, adminMiddleware, upload.single("image"), (req, res, next) => {
  req.body.imageType = 'content';
  next();
}, uploadController.uploadSingle);

// Delete uploaded file (admin)
router.delete('/:filename', authMiddleware, adminMiddleware, uploadController.deleteFile);

export default router;
