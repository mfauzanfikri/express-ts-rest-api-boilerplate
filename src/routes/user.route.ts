import express, { Router } from 'express';
import UserController from '../controllers/user.controller';

const UserRouter: Router = express.Router();
const controller = UserController;

UserRouter.get('/', controller.get);
UserRouter.get('/:id', controller.getById);
UserRouter.post('/', controller.post);
UserRouter.put('/', controller.put);
UserRouter.delete('/', controller.delete);

export const userRouteBaseUrl = `${process.env.BASE_URL}/users`;

export default UserRouter;
