import { NextFunction, Request, Response } from "express";
import { Consumer } from "../entities/Consumer.js";
import { ConsumerModel } from "../model/Consumer.js";

export class ConsumersController {
    public async find(req: Request, res: Response, next: NextFunction) {
        try {
            let { page = 1, pageSize = 10 } = req.query;
            const query: any = {
                deletedAt: null
            };

            page = parseInt(page as string);
            pageSize = parseInt(pageSize as string);
            const skip = (page - 1) * pageSize;

            const consumers = (await ConsumerModel.find(query).lean().skip(skip).limit(pageSize).sort({ _id: -1 }).exec());

            return res.status(200).send({ results: consumers, total: await ConsumerModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO CONSUMIDORES: ", error);
            return next(error);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = await ConsumerModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!consumer) return res.status(404).send({ message: `Consumidor não encontrado: ${req.query.id}` });
        return res.status(200).send(consumer);
      } catch (error) {
        console.error("ERRO BUSCANDO CONSUMIDOR: ", error);
        return next(error);
      }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = new ConsumerModel(req.body as Consumer);

        //* Persiste o usuário no BD
        await ConsumerModel.create(consumer);
    
        //* Retorna o usuário criado
        return res.status(201).send(consumer);
      } catch (error) {
        console.error("ERRO CRIANDO CONSUMIDOR: ", error);
        return next(error);
      }
    }

    public async register(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = new ConsumerModel(req.body);
        await ConsumerModel.create(consumer);

        return res.status(201).send(consumer);
      } catch (error) {
        console.error("ERRO CRIANDO CONSUMIDOR: ", error);
        return next(error);
      }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = await ConsumerModel.findOneAndUpdate({ _id: req.query.id, deletedAt: null }, { $set: req.body }, { new: true }).exec();
        if (!consumer) return res.status(404).send({ message: `Consumidor não encontrado: ${req.query._id}` });
    
        return res.status(200).send(consumer);
      } catch (error) {
        console.error("ERRO ATUALIZANDO CONSUMIDOR: ", error);
        return next(error);
      }
    }

    public async patch(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = await ConsumerModel.findById(req.query.id).exec();
        if (!consumer) return res.status(404).send({ message: `Consumidor não encontrado: ${req.query._id}` });

        //* Atualiza o usuário
        Object.assign(consumer, req.body);
        await consumer.save();

        return res.status(200).send(consumer);

        } catch (error) {
            console.error("ERRO ATUALIZANDO CONSUMIDOR: ", error);
            return next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        const consumer = await ConsumerModel.findById(req.query.id).exec();
        if (!consumer) return res.status(404).send({ message: `Consumidor não encontrado: ${req.query._id}` });

        await ConsumerModel.findOneAndUpdate({ _id: req.query._id }, { deletedAt: new Date() }).exec();
        return res.status(200).send(consumer);
        } catch (error) {
        console.error("ERRO REMOVENDO CONSUMIDOR: ", error);
        return next(error);
        }
    }
}
