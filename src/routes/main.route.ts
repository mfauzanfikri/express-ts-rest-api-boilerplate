import express, { Router } from 'express';
import Controller from '../controllers/main.controller';

const router: Router = express.Router();
const controller = Controller;

router.get('/', controller.get);

router.post('/', controller.post);

router.put('/', controller.put);

router.delete('/', controller.delete);

export default router;
