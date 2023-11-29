import express, { Router } from 'express';
import Controller from '../controllers/outgoingLetter';

const router: Router = express.Router();

router.get('/', Controller.get);
router.get('/:id', Controller.getById);
router.post('/', Controller.post);
router.put('/', Controller.put);
router.delete('/', Controller.delete);

const outgoingLetterRouter = router;

export default outgoingLetterRouter;
