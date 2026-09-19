
import Item from "../models/Item.js";
import Notification from "../models/Notification.js";

// ======================================
// CREATE ITEM
// ======================================
export const createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      color,
      location,
      latitude,
      longitude,
      date,
    } = req.body;

    // Validate required fields
    if (
      !type ||
      !title ||
      !description ||
      !category ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate type
    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either lost or found",
      });
    }

    // Create image path
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const item = await Item.create({
      type,
      title,
      description,
      category,
      color,
      location,
      latitude,
      longitude,
      date,
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Item reported successfully",
      item,
    });
  } catch (error) {
    console.error("Create item error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET ALL ITEMS
// ======================================
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get items error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET SINGLE ITEM
// ======================================
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("owner", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Get item error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// GET MY ITEMS
// ======================================
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get my items error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// DELETE ITEM
// ======================================
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only owner can delete
    if (
      item.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this item",
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// UPDATE ITEM
// ======================================
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      color,
      location,
      latitude,
      longitude,
      date,
    } = req.body;

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only owner can update
    if (
      item.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this item",
      });
    }

    // Update normal fields
    item.title = title ?? item.title;
    item.description =
      description ?? item.description;
    item.category = category ?? item.category;
    item.color = color ?? item.color;
    item.location = location ?? item.location;
    item.latitude = latitude ?? item.latitude;
    item.longitude = longitude ?? item.longitude;
    item.date = date ?? item.date;

    // Update image only if a new image was uploaded
    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    }

    await item.save();

    res.json({
      success: true,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Update item error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ======================================
// FIND POSSIBLE MATCHES
// ======================================
export const findMatches = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Lost -> search Found
    // Found -> search Lost
    const oppositeType =
      item.type === "lost" ? "found" : "lost";

    const possibleItems = await Item.find({
      _id: { $ne: item._id },
      type: oppositeType,
      status: "active",
    }).populate("owner", "name email");

    // ======================================
    // CALCULATE MATCHES
    // ======================================
    const matches = possibleItems
      .map((otherItem) => {
        let score = 0;
        const reasons = [];

        // ------------------------------
        // CATEGORY MATCH
        // ------------------------------
        if (
          item.category &&
          otherItem.category &&
          item.category.toLowerCase() ===
            otherItem.category.toLowerCase()
        ) {
          score += 30;
          reasons.push("Same category");
        }

        // ------------------------------
        // COLOR MATCH
        // ------------------------------
        if (
          item.color &&
          otherItem.color &&
          item.color.toLowerCase() ===
            otherItem.color.toLowerCase()
        ) {
          score += 20;
          reasons.push("Same color");
        }

        // ------------------------------
        // LOCATION MATCH
        // ------------------------------
        if (
          item.location &&
          otherItem.location &&
          item.location.toLowerCase() ===
            otherItem.location.toLowerCase()
        ) {
          score += 25;
          reasons.push("Same location");
        }

        // ------------------------------
        // TITLE MATCH
        // ------------------------------
        if (
          item.title &&
          otherItem.title &&
          item.title.toLowerCase() ===
            otherItem.title.toLowerCase()
        ) {
          score += 15;
          reasons.push("Similar title");
        }

        // ------------------------------
        // DESCRIPTION MATCH
        // ------------------------------
        if (
          item.description &&
          otherItem.description
        ) {
          const words = item.description
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word.length > 3);

          const otherDescription =
            otherItem.description.toLowerCase();

          const commonWords = words.filter((word) =>
            otherDescription.includes(word)
          );

          if (commonWords.length > 0) {
            score += Math.min(
              commonWords.length * 5,
              10
            );

            reasons.push("Similar description");
          }
        }

        return {
          item: otherItem,
          score,
          reasons,
        };
      })
      .filter((match) => match.score >= 30)
      .sort((a, b) => b.score - a.score);

    // ======================================
    // CREATE MATCH NOTIFICATIONS
    // ======================================
    if (matches.length > 0) {
      const notifications = matches.map((match) => ({
        user: match.item.owner._id,
        type: "match",
        title: "Possible Item Match Found",
        message: `A possible match was found for "${item.title}". Match score: ${match.score}%`,
        relatedItem: item._id,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
    }

    // ======================================
    // SEND RESPONSE
    // ======================================
    return res.status(200).json({
      success: true,
      itemId: item._id,
      matchCount: matches.length,
      matches,
    });
  } catch (error) {
    console.error(
      "Find matches error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to find matches",
    });
  }
};

