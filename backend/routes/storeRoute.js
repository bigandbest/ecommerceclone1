import express from "express";
import multer from "multer";
import { addStore, updateStore, deleteStore, getAllStores } from "../controller/storeController.js";

const router = express.Router();
const upload = multer(); // memory storage by default

router.post("/", upload.single("image"), addStore);
router.put("/:id", upload.single("image"), updateStore);
router.delete("/:id", deleteStore);
router.get("/", getAllStores);

export default router;
