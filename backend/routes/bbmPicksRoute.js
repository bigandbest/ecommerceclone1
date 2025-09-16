import express from "express"
import multer from "multer";
import { 
    addBbmPick,
    editBbmPick,
    deleteBbmPick,
    getAllBbmPicks,
    getSingleBbmPick
} from '../controller/bbmpicksController.js'

const router = express.Router();
const upload = multer();

router.post('/add', upload.single("image_url"), addBbmPick);
router.put('/update/:id', upload.single("image"), editBbmPick);
router.delete('/delete/:id', deleteBbmPick);
router.get('/list', getAllBbmPicks);
router.get('/:id', getSingleBbmPick);

export default router;