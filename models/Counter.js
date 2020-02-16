const { Schema, model } = require("mongoose");

const countSchema = Schema({
  userID: String,
  username: String,
  time: Number
});

module.exports = model("Count", countSchema)