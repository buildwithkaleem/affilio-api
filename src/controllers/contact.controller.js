import { contactModel } from "../models/contact.model.js";
import { notificationModel } from "../models/notification.model.js";
import { userModel } from "../models/user.model.js";


// ========================================
// CREATE CONTACT
// ========================================

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create contact message
    const contact = await contactModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Find all active admins
    const admins = await userModel.find({
      role: "admin",
      isActive: true,
    }).select("_id");

    // Create notification for every admin
    if (admins.length > 0) {
      const notifications = admins.map((admin) => ({
        user: admin._id,
        title: "New Contact Message",
        message: `${name.trim()} sent you a new contact message.`,
        type: "contact",
        referenceId: contact._id,
        isRead: false,
      }));

      await notificationModel.insertMany(notifications);
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contact,
    });

  } catch (error) {
    console.error("Create Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



// ========================================
// GET ALL CONTACTS - ADMIN
// ========================================

export const getAllContacts = async (req, res) => {
  try {

// 🔐 Admin check
    if (req.user?.role !== "admin") {
      return responseHandler(res, 403, {}, "Access denied", false);
    }

    const contacts = await contactModel
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });

  } catch (error) {
    console.error("Get All Contacts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
    });
  }
};


// ========================================
// GET SINGLE CONTACT - ADMIN
// ========================================

export const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔐 Admin check
        if (req.user?.role !== "admin") {
          return responseHandler(res, 403, {}, "Access denied", false);
        }

    const contact = await contactModel.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      contact,
    });

  } catch (error) {
    console.error("Get Single Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact message",
    });
  }
};


// ========================================
// DELETE CONTACT - ADMIN
// ========================================

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔐 Admin check
        if (req.user?.role !== "admin") {
          return responseHandler(res, 403, {}, "Access denied", false);
        }

    const contact = await contactModel.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    // Delete related notifications
    // await notificationModel.deleteMany({
    //   type: "contact",
    //   referenceId: id,
    // });

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });

  } catch (error) {
    console.error("Delete Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message",
    });
  }
};