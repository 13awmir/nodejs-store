const { default: mongoose } = require("mongoose");

const Schema = new mongoose.Schema({});

module.exports = {
  PaymeentModel: mongoose.model("payment", Schema),
};
