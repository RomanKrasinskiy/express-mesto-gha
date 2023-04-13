const mongoose = require("mongoose");
const validate = require("mongoose-validator");
const URLvalidator = validate({ validator: "isURL" });

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    validate: URLvalidator,
    type: String,
    required: true,
  },

  owner: {
    ref: "user",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    ref: "user",
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
