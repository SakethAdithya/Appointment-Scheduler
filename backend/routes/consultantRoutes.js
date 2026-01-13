const express = require("express");
const router = express.Router();
const consultantController = require("../controllers/consultantController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public/User routes - Anyone authenticated can view consultants
router.get("/", verifyToken, consultantController.getAllConsultants);
router.get("/:id", verifyToken, consultantController.getConsultantById);

// Admin only routes
router.post("/", verifyToken, isAdmin, consultantController.createConsultant);
router.put("/:id", verifyToken, isAdmin, consultantController.updateConsultant);
router.delete("/:id", verifyToken, isAdmin, consultantController.deleteConsultant);

module.exports = router;