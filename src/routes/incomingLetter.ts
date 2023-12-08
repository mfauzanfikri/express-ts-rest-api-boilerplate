import express, { Router } from 'express';
import Controller from '../controllers/incomingLetter';
import authAPIKey from '../middlewares/authAPIKey';
import authToken from '../middlewares/authToken';

const router: Router = express.Router();

router.get('/', authAPIKey, Controller.get);
router.get('/:id', authAPIKey, Controller.getById);
router.post('/', [authAPIKey, authToken], Controller.post);
router.put('/', [authAPIKey, authToken], Controller.put);
router.delete('/', [authAPIKey, authToken], Controller.delete);

const incomingLetterRouter = router;

export default incomingLetterRouter;
