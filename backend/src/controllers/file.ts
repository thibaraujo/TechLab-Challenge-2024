"use strict";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { CustomRequest } from "../interfaces/ICustomRequest.js";
import { ConversationMessageModel } from "../model/ConversationMessage.js";
import { deleteFile, getFiles, recoverFile, updateFile, uploadFile } from "../services/file.js";
import { ConversationMessageBy, ConversationMessageType } from "../entities/ConversationMessage.js";

export class FilesController {
  public async upload(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { file } = req as any;
      const { user, conversation } = req.query;
      if (!file) throw "Necessário anexar arquivo.";
      if(!conversation) throw "Necessário informar a conversa.";
    
      //* Ajuste nome do arquivo
      const fileName = file.originalname.replace(/[^\w\s.]/g, "").replace(/ /g, "_");
      file.originalname = fileName;

      //* Upload do arquivo
      const upload = await uploadFile(file);

      //* Caso tenha feito o upload, criar uma mensagem de conversa com o arquivo
      if(upload) {
        const conversationMessageConstructor = new ConversationMessageModel({
            content: `Arquivo ${fileName} enviado.`,
            by: user ? ConversationMessageBy.User : ConversationMessageBy.Consumer,
            conversation: conversation,
            createdAt: new Date(),
            type: ConversationMessageType.FILE,
            fileId: upload._id,
            user: user || null
        });
        await ConversationMessageModel.create(conversationMessageConstructor);
      }

      return res.status(200).send(upload);
    } catch (error: Error | any) {
      console.error("ERRO CRIANDO ARQUIVO: ", error);
      return next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      let query: any = { "metadata.deletedAt": null };
      if (req.query.conversationMessage) query["metadata.conversationMessage"] = new mongoose.Types.ObjectId(req.query.conversationMessage.toString());
      if (req.query.fileName) query.filename = { $regex: req.query.fileName.toString(), $options: "i" };
      if (req.query.id) query._id = new mongoose.Types.ObjectId(req.query.id.toString());
      if (req.query.version) query["metadata.version"] = parseInt(req.query.version.toString());
      
      const files = await getFiles(query);

      return res.send({ results: files.files, total: files.count });
    } catch (error) {
      console.error("ERRO LISTANDO ARQUIVOS: ", error);
      return next(error);
    }
  }

  async recover(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.query.file) throw "Arquivo não informado.";
      const document = await recoverFile(new mongoose.Types.ObjectId(req.query.file.toString()));
      if (!document) throw "Conteúdo do arquivo não encontrado.";

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${document.filename}"`);
      res.status(200).send(document);
    } catch (error) {
      console.error("ERRO EDITANDO ARQUIVO: ", error);
      return next(error);
    }
  }

  async delete(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.query.id) throw "Necessário informar o id do arquivo.";
      const fileId = new mongoose.Types.ObjectId(req.query.id.toString());
      const deleted = await deleteFile(fileId);
      return res.status(200).send(deleted);
    } catch (error) {
      console.error("ERRO DELETANDO ARQUIVO: ", error);
      return next(error);
    }
  }

  async update(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.query.id) throw "Necessário informar o id do arquivo.";
      if (!req.body) throw "Necessário informar dados a serem atualizados.";

      const fileId = new mongoose.Types.ObjectId(req.query.id.toString());
      const updated = await updateFile(fileId, req.body);

      return res.status(200).send(updated);
    } catch (error) {
      console.error("ERRO ATUALIZANDO ARQUIVO: ", error);
      return next(error);
    }
  }
};