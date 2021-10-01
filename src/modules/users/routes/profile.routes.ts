import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAutenticated from '@shared/http/middlewares/isAutenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAutenticated); //Sendo chamado antes, automaticamente todas as rotas vão utilizar este middleware de autenticação.

//Lista o perfil do usuário autenticado na aplicação
profileRouter.get('/', profileController.show);

//Atualiza o perfil do usuário autenticado na aplicação
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      old_password: Joi.string().optional(), //optional dá a opção de implementar a validação da confirmação da senha.
      password_confirmation: Joi.string() //Validação da confirmação da senha
        .valid(Joi.ref('password'))
        .when('password', {
          is: Joi.exist(),
          then: Joi.required(),
        }),
    },
  }),
  profileController.update,
);

export default profileRouter;
