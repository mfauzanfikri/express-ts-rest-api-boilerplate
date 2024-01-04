import express, { Router } from 'express';
import Controller from '../controllers/user';
import authAPIKey from '../middlewares/authAPIKey';
import authToken from '../middlewares/authToken';

const router: Router = express.Router();

router.get('/', authAPIKey, Controller.get);
router.get('/:id', authAPIKey, Controller.getById);
router.get('/employees/:id', authAPIKey, Controller.getByEmployeeId);
router.post('/', authToken, Controller.post);
router.put('/', authToken, Controller.put);
router.delete('/', authToken, Controller.delete);

const userRouter = router;

export default userRouter;
