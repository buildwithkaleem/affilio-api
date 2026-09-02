import express from "express";

import {
  createContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
} from "../controllers/contact.controller.js";

import { auth } from "../middleware/authMiddleware.js";

const contactRouter = express.Router();


// ========================================
// PUBLIC
// ========================================

contactRouter.post("/", createContact);


// ========================================
// ADMIN
// ========================================

contactRouter.get("/getAllContacts", auth, getAllContacts);

contactRouter.get("/contact/:id", auth, getSingleContact);

contactRouter.delete("/contact/:id", auth, deleteContact);


export default contactRouter;