import { NextFunction, Request, Response } from "express";
import { Conversation } from "../entities/Conversation.js";
import bcrypt from "bcrypt";
import { ConversationModel } from "../model/Conversation.js";

export class ConversationsController {

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
            const conversations = (await ConversationModel.find(query).lean().skip(skip).limit(pageSize).sort({ _id: -1 }).exec());

            //* Retorna a lista de usuários
            return res.status(200).send({ results: conversations, total: await ConversationModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO USUÁRIOS: ", error);
            return next(error);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const conversation = await ConversationModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!conversation) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query.id}` });
        return res.status(200).send(conversation);
      } catch (error) {
        console.error("ERRO BUSCANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
      try {
        const conversation = new ConversationModel(req.body as Conversation);
          
        await ConversationModel.create(conversation);

        return res.status(201).send(conversation);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }

}
