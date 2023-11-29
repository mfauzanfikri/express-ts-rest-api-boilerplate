import express, { Router } from 'express';
import Controller from '../controllers/instruction';

const router: Router = express.Router();

router.get('/', Controller.get);
// router.get('/:id', Controller.getById);
// router.post('/', Controller.post);
// router.put('/', Controller.put);
// router.delete('/', Controller.delete);

const instructionRouter = router;

export default instructionRouter;
