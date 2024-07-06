import { NextFunction, Request, Response } from "express";
import { Conversation } from "../entities/Conversation.js";
import { ConversationModel } from "../model/Conversation.js";
import mongoose from "mongoose";
import { CustomRequest } from "../interfaces/ICustomRequest.js";
import { UserModel } from "../model/user.js";

export class ConversationsController {

    public async find(req: Request, res: Response, next: NextFunction) {
        try {
            const { consumer, user, distributed } = req.query;
            const query: any = {
                deletedAt: null
            };

            if(consumer) query.consumer = consumer;
            if(user) query.user = user;
            if(distributed) {
              if(distributed.toString().toLowerCase() == 'true') query.user = { $ne: null };
              else query.user = { $eq: null };
            } 

            const conversations = (await ConversationModel.find(query).lean().sort({ _id: -1 }).exec());

            return res.status(200).send({ results: conversations, total: await ConversationModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO CONVERSAS: ", error);
            return next(error);
        }
    }

    public async findMine(req: CustomRequest, res: Response, next: NextFunction) {
      try {
          const query: any = {
              deletedAt: null,
          };

          req.user ? query.user = req.user._id : query.consumer = req.consumer;
          const conversations = (await ConversationModel.find(query).lean().sort({ _id: -1 }).exec());

          return res.status(200).send({ results: conversations, total: await ConversationModel.countDocuments(query) });
      } catch (error) {
          console.error("ERRO LISTANDO CONVERSAS: ", error);
          return next(error);
      }
  }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const conversation = await ConversationModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!conversation) return res.status(404).send({ message: `Conversa não encontrada: ${req.query.id}` });
        return res.status(200).send(conversation);
      } catch (error) {
        console.error("ERRO BUSCANDO CONVERSA: ", error);
        return next(error);
      }
    }

    public async create(req: CustomRequest, res: Response, next: NextFunction) {
      try {
        const conversation = new ConversationModel({ ...req.body, consumer: req.consumer } as Conversation);
          
        await ConversationModel.create(conversation);

        return res.status(201).send(conversation);
      } catch (error) {
        console.error("ERRO CRIANDO CONVERSA: ", error);
        return next(error);
      }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        console.log(req.query.id);
        const conversation = await ConversationModel.findOne({_id: new mongoose.Types.ObjectId(req.query.id?.toString()), deletedAt: null}).exec();
        if (!conversation) return res.status(404).send({ message: `Conversa não encontrada: ${req.query.id}` });
        conversation.deletedAt = new Date();
        await conversation.save();
        return res.status(200).send(conversation);
      } catch (error) {
        console.error("ERRO BUSCANDO CONVERSA: ", error);
        return next(error);
      }
    }

    // public async distribute(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const totalUsers = await UserModel.find({ deletedAt: null }).lean().exec();
    //     const usersInfo = await Promise.all(totalUsers.map(async (user) => {
    //       const userConversations = await ConversationModel.find({ user: user._id, deletedAt: null }).lean().exec();
    //       const userConversationsCount = userConversations.length;

    //       return { user, userConversationsCount };
    //     })); 

    //     const usersInfoSorted = usersInfo.sort((a, b) => a.userConversationsCount - b.userConversationsCount);
    //     const userToDistribute = usersInfoSorted[0].user;

    //     return res.status(200).send(userToDistribute);
    //   } catch (error) {
    //     console.error("ERRO DISTRIBUINDO CONVERSAS: ", error);
    //     return next(error);
    //   }
    // }

    // public async distribute(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const totalConversations = await ConversationModel.find({ deletedAt: null, user: null }).lean().exec();
    //     const totalUsers = await UserModel.find({ deletedAt: null }).lean().exec();

    //     for(let i = 0; i < totalConversations.length; i++) {
    //       const conversation = totalConversations[i];
    //       const userToDistribute = totalUsers[i % totalUsers.length];
    //       await ConversationModel.updateOne({ _id: conversation._id }, { $set: { user: userToDistribute._id } }).exec();
    //     }

    //   } catch (error) {
    //     console.error("ERRO DISTRIBUINDO CONVERSAS: ", error);
    //     return next(error);
    //   }
    // }

    public async distribute(req: Request, res: Response, next: NextFunction) {
      try {
        const totalConversations = await ConversationModel.find({ deletedAt: null, user: null }).lean().exec();
        const totalUsers = await UserModel.find({ deletedAt: null, available: true }).lean().exec();

        console.log(totalConversations.length, totalUsers.length);
        
        const bulkUpdates = totalConversations.map((conversation, i) => {
          const userToDistribute = totalUsers[i % totalUsers.length];
          return {
            updateOne: {
              filter: { _id: conversation._id },
              update: { $set: { user: userToDistribute._id } }
            }
          };
        });
    
        if (bulkUpdates.length > 0) await ConversationModel.bulkWrite(bulkUpdates);
        
        return res.status(200).send({ message: "Conversas distribuídas com sucesso." });
      } catch (error) {
        console.error("ERRO DISTRIBUINDO CONVERSAS: ", error);
        return next(error);
      }
    }

}
