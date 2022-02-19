import 'reflect-metadata'; //Esta importação tem que ser a primeira da aplicação (Particularidade).
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors'; //Trata excecoes geradas a partir de uma promessa
import cors from 'cors';
import { errors } from 'celebrate';
import { pagination } from 'typeorm-pagination';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

//Middleware Globais
app.use(cors());
app.use(express.json());
app.use(rateLimiter); //Middleware de segurança (Limite de quantidade de requisição)
app.use(pagination); //Middleware de paginação
app.use('/files', express.static(uploadConfig.directory)); //Criando a rota estática para os arquivos enviados via upload.
app.use(routes);
app.use(errors()); //Tratamento de erros do celebrate.

//Middleware for catch erros on application
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    /*Utilizado para detectar erros na aplicação*/
    //console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
