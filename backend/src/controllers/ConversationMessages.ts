import { NextFunction, Request, Response } from "express";
import { ConversationMessage } from "../entities/ConversationMessage.js";
import bcrypt from "bcrypt";
import { ConversationMessageModel } from "../model/ConversationMessage.js";
import { CustomRequest } from "../services/authentication.js";

export class ConversationMessagesController {
    public async find(req: Request, res: Response, next: NextFunction) {
        try {
            //* Recebe os filtros de busca e paginação
            let { page = 1, pageSize = 10 } = req.query;
            let conversationId  = req.query.id;
            //* Cria o objeto de busca
            const query: any = {
                deletedAt: null
            };

            if (conversationId) query.conversation = conversationId;
            

            //* Converte a páginação para números e calcula o offset para a paginação
            page = parseInt(page as string);
            pageSize = parseInt(pageSize as string);
            const skip = (page - 1) * pageSize;

            //* Busca os usuários no BD, utilizando os filtros e ordenando por data de criação
            const conversationMessages = (await ConversationMessageModel.find(query).lean().skip(skip).limit(pageSize).sort({ _id: -1 }).exec());

            //* Retorna a lista de usuários
            return res.status(200).send({ results: conversationMessages, total: await ConversationMessageModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO USUÁRIOS: ", error);
            return next(error);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const conversationMessage = await ConversationMessageModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!conversationMessage) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query.id}` });
        return res.status(200).send(conversationMessage);
      } catch (error) {
        console.error("ERRO BUSCANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async createAdmin(req: CustomRequest, res: Response, next: NextFunction) {
      try {
        const conversationMessage = new ConversationMessageModel({...req.body, user: req.user?._id});

        await ConversationMessageModel.create(conversationMessage);

        return res.status(201).send(conversationMessage);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const conversationMessage = await ConversationMessageModel.findOneAndUpdate({ _id: req.query.id, deletedAt: null }, { $set: req.body }, { new: true }).exec();
        if (!conversationMessage) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });
    
        //* Retorna o usuário atualizado
        return res.status(200).send(conversationMessage);
      } catch (error) {
        console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    // delete
    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        console.log(req.query.id);
        const conversationMessage = await ConversationMessageModel.findById(req.query.id).exec();
        if (!conversationMessage) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });

        //* Remove o usuário
        await ConversationMessageModel.findOneAndUpdate({ _id: req.query._id }, { deletedAt: new Date() }).exec();

        //* Retorna o usuário removido
        return res.status(200).send(conversationMessage);
        } catch (error) {
        console.error("ERRO REMOVENDO USUÁRIO: ", error);
        return next(error);
        }
    }
}
