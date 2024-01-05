import express, { Router } from 'express';
import Controller from '../controllers/dispositionStatus';
import authAPIKey from '../middlewares/authAPIKey';

const router: Router = express.Router();

router.get('/', authAPIKey, Controller.get);
// router.get('/:id', Controller.getById);
// router.post('/', Controller.post);
// router.put('/', Controller.put);
// router.delete('/', Controller.delete);

const dispositionStatusRouter = router;

export default dispositionStatusRouter;
