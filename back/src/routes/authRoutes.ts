import { Router } from 'express';
import { register, login, refreshToken} from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh_token', refreshToken);


export default router;
