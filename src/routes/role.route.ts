import express, { Router } from 'express';
import RoleController from '../controllers/role.controller';

const RoleRouter: Router = express.Router();
const controller = RoleController;

RoleRouter.get('/', controller.get);
// RoleRouter.get('/:id', controller.getById);
// RoleRouter.post('/', controller.post);
// RoleRouter.put('/', controller.put);
// RoleRouter.delete('/', controller.delete);

export const roleRouteBaseUrl = `${process.env.BASE_URL}/roles`;

export default RoleRouter;
