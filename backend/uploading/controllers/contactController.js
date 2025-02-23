const ContactInfo = require("../models/ContactInfo");

// Get contact information
exports.getContactInfo = async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = await ContactInfo.create({ telegramLink: "", whatsappLink: "" });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact info", error });
  }
};

// Update contact information (Partial Update)
exports.updateContactInfo = async (req, res) => {
  const { telegramLink, whatsappLink } = req.body;

  try {
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = new ContactInfo();
    }

    // Update only provided fields
    if (telegramLink !== undefined) contact.telegramLink = telegramLink;
    if (whatsappLink !== undefined) contact.whatsappLink = whatsappLink;

    await contact.save();

    res.json({ message: "Contact info updated successfully!", contact });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact info", error });
  }
};
