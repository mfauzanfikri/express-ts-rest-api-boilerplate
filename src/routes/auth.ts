import express, { Router } from 'express';
import AuthController from '../controllers/auth';

const router: Router = express.Router();
const controller = AuthController;

router.post('/', controller.post);
router.post('/token', controller.authToken);
router.get('/logout', controller.logout);

const authRouter = router;

export default authRouter;
