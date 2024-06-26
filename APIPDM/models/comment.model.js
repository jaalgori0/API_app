const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = Mongoose.model("Comment", CommentSchema);
