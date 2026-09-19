import express from "express";

import {
createItem,
getAllItems,
getItemById,
getMyItems,
deleteItem,
updateItem,
findMatches,
} from "../controllers/itemController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create lost/found report
router.post(
"/",
authMiddleware,
upload.single("image"),
createItem
);

// Get all reports
router.get(
"/",
getAllItems
);

// Get logged-in user's reports
router.get(
"/my",
authMiddleware,
getMyItems
);

// Find possible matches
router.get(
"/:id/matches",
authMiddleware,
findMatches
);

// Get single report
router.get(
"/:id",
getItemById
);

// Delete report
router.delete(
"/:id",
authMiddleware,
deleteItem
);

// Update item
router.put(
"/:id",
authMiddleware,
upload.single("image"),
updateItem
);

export default router;
