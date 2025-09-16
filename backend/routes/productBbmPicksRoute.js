import express from 'express'
const router = express.Router();

import {
    mapProductToBbmPick,
    removeProductFromBbmPick,
    getBbmPicksForProduct,
    getProductsForBbmPick,
    bulkMapByNames
} from '../controller/productBbmPicksController.js'

// Map a single product to a BBM Pick (by ID)
router.post('/map', mapProductToBbmPick);

// Bulk map using names (for admin UI)
router.post('/map-bulk', bulkMapByNames);

// Remove product from a BBM Pick
router.post('/remove', removeProductFromBbmPick);

// Get all BBM Picks for a product
router.get('/product/:product_id', getBbmPicksForProduct);

// Get all products in a BBM Pick
router.get('/:bbmpicks_id', getProductsForBbmPick);

export default router;