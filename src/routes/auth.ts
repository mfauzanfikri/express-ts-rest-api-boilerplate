import express, { Router } from 'express';
import AuthController from '../controllers/auth';

const router: Router = express.Router();
const controller = AuthController;

router.post('/', controller.post);
router.post('/token', controller.AuthToken);

const authRouter = router;

export default authRouter;
