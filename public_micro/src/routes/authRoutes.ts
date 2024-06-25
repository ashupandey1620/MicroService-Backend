import { Router } from 'express';
import {profile, candidate, getApiKey} from '../controllers/authController';

const router = Router();

router.post('/getApiKey', getApiKey);
router.post('/profile', profile);
router.get('/candidate', candidate);


export default router;
