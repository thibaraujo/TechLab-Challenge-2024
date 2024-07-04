import { NextFunction, Request, Response } from "express";
import { Consumer } from "../entities/Consumer.js";
import bcrypt from "bcrypt";
import { ConsumerModel } from "../model/Consumer.js";

export class ConsumersController {

  /**
   * GET /consumers
   */
    public async find(req: Request, res: Response, next: NextFunction) {
        try {
            //* Recebe os filtros de busca e paginação
            let { page = 1, pageSize = 10 } = req.query;

            //* Cria o objeto de busca
            const query: any = {
                deletedAt: null
            };

            //* Converte a páginação para números e calcula o offset para a paginação
            page = parseInt(page as string);
            pageSize = parseInt(pageSize as string);
            const skip = (page - 1) * pageSize;

            //* Busca os usuários no BD, utilizando os filtros e ordenando por data de criação
            const consumers = (await ConsumerModel.find(query).lean().skip(skip).limit(pageSize).sort({ _id: -1 }).exec());

            //* Retorna a lista de usuários
            return res.status(200).send({ results: consumers, total: await ConsumerModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO USUÁRIOS: ", error);
            return next(error);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = await ConsumerModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!consumer) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query.id}` });
        return res.status(200).send(consumer);
      } catch (error) {
        console.error("ERRO BUSCANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async createAdmin(req: Request, res: Response, next: NextFunction) {
      try {
        //* Cria um novo usuário
        const consumer = new ConsumerModel(req.body as Consumer);

        //* Salva o usuário no BD
        await ConsumerModel.create(consumer);
    
        //* Retorna o usuário criado
        return res.status(201).send(consumer);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async register(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = new ConsumerModel(req.body);
        console.log(consumer);

        await ConsumerModel.create(consumer);

        return res.status(201).send(consumer);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }


    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const consumer = await ConsumerModel.findOneAndUpdate({ _id: req.query.id, deletedAt: null }, { $set: req.body }, { new: true }).exec();
        if (!consumer) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });
    
        //* Retorna o usuário atualizado
        return res.status(200).send(consumer);
      } catch (error) {
        console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    // patch consumer
    public async patch(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const consumer = await ConsumerModel.findById(req.query.id).exec();
        if (!consumer) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });

        //* Atualiza o usuário
        Object.assign(consumer, req.body);
        await consumer.save();

        return res.status(200).send(consumer);

        } catch (error) {
            console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
            return next(error);
        }
    }

    // delete
    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const consumer = await ConsumerModel.findById(req.query.id).exec();
        if (!consumer) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });

        //* Remove o usuário
        await ConsumerModel.findOneAndUpdate({ _id: req.query._id }, { deletedAt: new Date() }).exec();

        //* Retorna o usuário removido
        return res.status(200).send(consumer);
        } catch (error) {
        console.error("ERRO REMOVENDO USUÁRIO: ", error);
        return next(error);
        }
    }
}
