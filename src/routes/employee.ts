import express, { Router } from 'express';
import Controller from '../controllers/employee';
import authAPIKey from '../middlewares/authAPIKey';
import authToken from '../middlewares/authToken';

const router: Router = express.Router();

router.get('/', authAPIKey, Controller.get);
router.get('/:id', authAPIKey, Controller.getById);
router.post('/', authToken, Controller.post);
router.put('/', authToken, Controller.put);
router.delete('/', authToken, Controller.delete);

const employeeRouter = router;

export default employeeRouter;
