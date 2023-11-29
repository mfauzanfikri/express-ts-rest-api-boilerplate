import express, { Router } from 'express';
import Controller from '../controllers/userLevel';

const router: Router = express.Router();

router.get('/', Controller.get);
// router.get('/:id', Controller.getById);
// router.post('/', Controller.post);
// router.put('/', Controller.put);
// router.delete('/', Controller.delete);

const userLevelRouter = router;

export default userLevelRouter;
