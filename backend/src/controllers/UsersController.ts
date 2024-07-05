import { NextFunction, Request, Response } from "express";
import { Profile, User } from "../entities/User.js";
import bcrypt from "bcrypt";
import { UserModel } from "../model/user.js";

export class UsersController {
    public async find(req: Request, res: Response, next: NextFunction) {
        try {
            let { page = 1, pageSize = 10 } = req.query;

            const query: any = { deletedAt: null };

            page = parseInt(page as string);
            pageSize = parseInt(pageSize as string);
            const skip = (page - 1) * pageSize;

            const users = (await UserModel.find(query).lean().skip(skip).limit(pageSize).sort({ _id: -1 }).exec());

            return res.status(200).send({ results: users, total: await UserModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO USUÁRIOS: ", error);
            return next(error);
        }
    }

    public async findOne(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await UserModel.findOne({_id: req.params.id, deletedAt: null}).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado: ${req.query.id}` });
        return res.status(200).send(user);
      } catch (error) {
        console.error("ERRO BUSCANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async createAdmin(req: Request, res: Response, next: NextFunction) {
      try {
        const user = new UserModel(req.body as User);

        if (!user.password) return res.status(400).send({ message: "Senha não informada" });
        const passwordHash = await bcrypt.hash(user.password, 10);
        user.password = passwordHash;
          
        await UserModel.create(user);
    
        return res.status(201).send(user);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async register(req: Request, res: Response, next: NextFunction) {
      try {
        const user = new UserModel({...req.body, profile: Profile.Standard});

        if (!user.password) return res.status(400).send({ message: "Senha não informada." });
        const passwordHash = await bcrypt.hash(user.password, 10);
        user.password = passwordHash;
          
        await UserModel.create(user);

        return res.status(201).send(user);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await UserModel.findOneAndUpdate({ _id: req.query.id, deletedAt: null }, { $set: req.body }, { new: true }).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado: ${req.query._id}` });
    
        return res.status(200).send(user);
      } catch (error) {
        console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    public async patch(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await UserModel.findById(req.query.id).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });

        Object.assign(user, req.body);
        await user.save();

        return res.status(200).send(user);

        } catch (error) {
            console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
            return next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        const user = await UserModel.findById(req.query.id).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado: ${req.query._id}` });

        await UserModel.findOneAndUpdate({ _id: req.query._id }, { deletedAt: new Date() }).exec();

        //* Retorna o usuário removido
        return res.status(200).send(user);
        } catch (error) {
        console.error("ERRO REMOVENDO USUÁRIO: ", error);
        return next(error);
        }
    }

}
