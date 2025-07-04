import { Router } from 'express';
import { identifyContact } from '../controllers/contact.controller';

const router = Router();
router.post('/', identifyContact);
export default router;
