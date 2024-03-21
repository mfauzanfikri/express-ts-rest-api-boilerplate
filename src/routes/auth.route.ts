import express, { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router: Router = express.Router();
const controller = AuthController;

router.post('/', controller.post);
router.post('/token', controller.authToken);

const AuthRouter = router;

export default AuthRouter;
