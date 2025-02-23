const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
  telegramLink: { type: String, default: "" },
  whatsappLink: { type: String, default: "" },
});

module.exports = mongoose.model("ContactInfo", contactInfoSchema);
