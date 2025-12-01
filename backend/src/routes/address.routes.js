import express from 'express';
import {
    getMyAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from '../controllers/address.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getMyAddresses);
router.get('/:id', getAddressById);
router.post('/', createAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.post('/:id/set-default', setDefaultAddress);

export default router;
