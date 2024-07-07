import { NextFunction, Request, Response } from "express";
import { ConversationMessageModel } from "../model/ConversationMessage.js";
import { ConversationMessage } from "../entities/ConversationMessage.js";

export class ConversationMessagesController {
    public async find(req: Request, res: Response, next: NextFunction) {
        try {
            let conversationId  = req.query.id;
            const query: any = {};

            if (conversationId) query.conversation = conversationId;
            const conversationMessages = (await ConversationMessageModel.find(query).lean().sort({ createdAt: 1 }).exec());

            return res.status(200).send({ results: conversationMessages, total: await ConversationMessageModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO MENSAGEMS: ", error);
            return next(error);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const conversationMessage = await ConversationMessageModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!conversationMessage) return res.status(404).send({ message: `Mensagem não encontrada: ${req.query.id}` });
        return res.status(200).send(conversationMessage);
      } catch (error) {
        console.error("ERRO BUSCANDO MENSAGEM: ", error);
        return next(error);
      }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
      try {
        console.log("BODY: ", req.body);
        const conversationMessage = new ConversationMessageModel(req.body as ConversationMessage);
        const created = await ConversationMessageModel.create(conversationMessage);
        console.log("CREATED: ", created);
        return res.status(201).send(conversationMessage);
      } catch (error) {
        console.error("ERRO CRIANDO MENSAGEM: ", error);
        return next(error);
      }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        const conversationMessage = await ConversationMessageModel.findOneAndUpdate({ _id: req.query.id, deletedAt: null }, { $set: req.body }, { new: true }).exec();
        if (!conversationMessage) return res.status(404).send({ message: `Mensagem não encontrada: ${req.query._id}` });
    
        return res.status(200).send(conversationMessage);
      } catch (error) {
        console.error("ERRO ATUALIZANDO MENSAGEM: ", error);
        return next(error);
      }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        const conversationMessage = await ConversationMessageModel.findById(req.query.id).exec();
        if (!conversationMessage) return res.status(404).send({ message: `Mensagem não encontrada: ${req.query._id}` });

        await ConversationMessageModel.findOneAndUpdate({ _id: req.query._id }, { deletedAt: new Date() }).exec();

        return res.status(200).send(conversationMessage);
        } catch (error) {
        console.error("ERRO REMOVENDO MENSAGEM: ", error);
        return next(error);
        }
    }
}
