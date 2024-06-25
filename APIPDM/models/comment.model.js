const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
}, { timestamps: true });

module.exports = Mongoose.model("Comment", CommentSchema);
