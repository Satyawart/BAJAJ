import { Router } from 'express';
import { handleBfhl } from '../controllers/bfhl.controller.js';

const router = Router();

router.post('/', handleBfhl);

// Standard BFHL requirement for GET route
router.get('/', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

export default router;
