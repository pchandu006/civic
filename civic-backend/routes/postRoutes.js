console.log("🔥 THIS IS THE ACTIVE POST ROUTES FILE 🔥");

const express = require("express");
const router = express.Router();   // 🔴 IMPORTANT

const Post = require("../models/Post");
const { protect, officerOnly } = require("../middleware/authMiddleware");
const { detectIssueFromImage } = require("../services/aiService");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* CREATE POST */

router.post("/create", protect, upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "Image is required ❗" });
    }

    const { description, latitude, longitude, areaName, fullAddress } = req.body;

    const imagePath = path.join(__dirname, "..", "uploads", req.file.filename);

    const aiResult = await detectIssueFromImage(imagePath);

    const newPost = new Post({
      user: req.user._id,
      issueType: aiResult.issueType,
      department: aiResult.department,
      priority: aiResult.priority,
      aiDetected: true,
      aiConfidence: aiResult.confidence,
      aiLabels: aiResult.labels,
      description,
      latitude,
      longitude,
      areaName,
      fullAddress,
      image: req.file.filename
    });

    await newPost.save();

    res.status(201).json({
      message: "Issue detected & reported successfully 🤖",
      post: newPost
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating post ❌",
      error: error.message
    });
  }
});


/* GET POSTS */

router.get("/", protect, async (req, res) => {

  try {

    const view = req.query.view;
    let filter = {};

    const userWard = req.user.ward;

    if (!view || view === "default") {
      filter = {};
    }

    else if (view === "myArea") {
      filter.areaName = userWard;
    }

    else if (view === "myPosts") {
      filter.user = req.user._id;
    }

    else if (view === "myDepartment") {
      filter.department = req.user.department;
    }

    const posts = await Post.find(filter)
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching posts ❌",
      error: error.message
    });

  }

});


/* UPDATE STATUS */

router.put(
  "/:id/status",
  protect,
  officerOnly,
  upload.single("resolvedImage"),
  async (req, res) => {

    try {

      const { status } = req.body;

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found ❌" });
      }

      if (post.department !== req.user.department) {
        return res.status(403).json({
          message: "You can only modify your department issues ❌"
        });
      }

      if (post.status === "Resolved") {
        return res.status(400).json({
          message: "Issue already resolved ❌"
        });
      }

      if (post.status === "Pending" && status === "In Progress") {
        post.status = "In Progress";
        post.inProgressAt = new Date();
      }

      else if (post.status === "In Progress" && status === "Resolved") {

        if (!req.file) {
          return res.status(400).json({
            message: "Resolution image required ❗"
          });
        }

        post.status = "Resolved";
        post.resolvedAt = new Date();
        post.resolvedImage = req.file.filename;
      }

      await post.save();

      res.json({
        message: "Status updated successfully ✅",
        post
      });

    } catch (error) {

      res.status(500).json({
        message: "Error updating status ❌",
        error: error.message
      });

    }

  }
);


/* DELETE POST */

router.delete("/:id", protect, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed ❌" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully ✅" });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting post ❌",
      error: error.message
    });

  }

});

module.exports = router;