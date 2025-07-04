import { Router } from 'express';
import { identify } from '../controllers/contact.controller';

// Route to identify or link a contact
const router = Router();

// POST /identify - Identify or link a contact based on email or phone number
// Expects JSON body with either email or phoneNumber
// Example: { "email": "abc@gmail.com", "phoneNumber": "1234567890" }
router.post('/identify', identify);

// Export the router to be used in the main app
export default router;