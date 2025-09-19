import express from "express";
import multer from "multer";
import { 
    addSavingZoneGroup, 
    mapSavingZoneToGroup,
    updateSavingZoneGroup, 
    deleteSavingZoneGroup, 
    getAllSavingZoneGroups, 
    getSavingZoneGroupById 
} from "../controller/savingZoneGroupController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/add", upload.any(), addSavingZoneGroup);
router.post("/map-saving-zone", upload.none(), mapSavingZoneToGroup); 
router.put("/update/:id", upload.any(), updateSavingZoneGroup);
router.delete("/delete/:id", deleteSavingZoneGroup);
router.get("/list", getAllSavingZoneGroups);
router.get("/:id", getSavingZoneGroupById);

export default router;