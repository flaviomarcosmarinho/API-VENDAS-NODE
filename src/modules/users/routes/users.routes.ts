import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import isAutenticated from '@shared/http/middlewares/isAutenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

//Listar um usuário
usersRouter.get('/', isAutenticated, usersController.index);

//Criar um usuário
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

//Upload de imagem (avatar)
usersRouter.patch(
  '/avatar',
  isAutenticated,
  upload.single('avatar'),
  usersAvatarController.update,
);

export default usersRouter;
