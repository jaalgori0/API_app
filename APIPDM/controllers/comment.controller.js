const Comment = require("../models/comment.model");
const Tour = require("../models/post.model");

const commentController = {};

commentController.createComment = async (req, res) => {
  const { content } = req.body;
  const { idtour } = req.params;
  const { user } = req; // Obteniendo el usuario autenticado del middleware

  if (!idtour || !content || !user) {
    return res.status(400).json({ error: "User, Tour ID, and content are required" });
  }

  try {
    const tour = await Tour.findById(idtour);
    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const comment = new Comment({
      user: user._id,
      tour: idtour,
      content: content,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

commentController.getCommentsByTour = async (req, res) => {
  const { tourId } = req.params;

  try {
    const comments = await Comment.find({ tour: tourId }).populate("user", "name email");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = commentController;
