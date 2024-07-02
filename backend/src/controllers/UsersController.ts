import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User.js";
import { UserModel } from "../model/User.js";
import bcrypt from "bcrypt";

export class UsersController {

  /**
   * GET /users
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
            const users = (await UserModel.find(query).lean().skip(skip).limit(pageSize).sort({ _id: -1 }).exec());

            //* Retorna a lista de usuários
            return res.status(200).send({ results: users, total: await UserModel.countDocuments(query) });
        } catch (error) {
            console.error("ERRO LISTANDO USUÁRIOS: ", error);
            return next(error);
        }
    }

    public async saveAdmin(req: Request, res: Response, next: NextFunction) {
      try {
        //* Cria um novo usuário
        const user = new UserModel(req.body as User);

        if (!user.password) return res.status(400).send({ message: "Senha não informada" });
        const passwordHash = await bcrypt.hash(user.password, 10);
        user.password = passwordHash;
          
        //* Salva o usuário no BD
        await UserModel.create(user);
    
        //* Retorna o usuário criado
        return res.status(201).send(user);
      } catch (error) {
        console.error("ERRO CRIANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    // Update user
    public async update(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const user = await UserModel.findOneAndUpdate({ _id: req.query.id, deletedAt: null }, { $set: req.body }, { new: true }).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });
    
        //* Retorna o usuário atualizado
        return res.status(200).send(user);
      } catch (error) {
        console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
        return next(error);
      }
    }

    // patch user
    public async patch(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const user = await UserModel.findById(req.query.id).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });

        //* Atualiza o usuário
        Object.assign(user, req.body);
        await user.save();

        return res.status(200).send(user);

        } catch (error) {
            console.error("ERRO ATUALIZANDO USUÁRIO: ", error);
            return next(error);
        }
    }

    // delete
    public async delete(req: Request, res: Response, next: NextFunction) {
      try {
        //* Busca o usuário no BD
        const user = await UserModel.findById(req.query.id).exec();
        if (!user) return res.status(404).send({ message: `Usuário não encontrado com ID ${req.query._id}` });

        //* Remove o usuário
        await UserModel.findOneAndUpdate({ _id: req.query._id }, { deletedAt: new Date() }).exec();

        //* Retorna o usuário removido
        return res.status(200).send(user);
        } catch (error) {
        console.error("ERRO REMOVENDO USUÁRIO: ", error);
        return next(error);
        }
    }


//   /**
//    * GET /users/:user-_id
//    */
//   public async findOne(req: Request<{ userId: string }>, res: Response) {
//     const user = await this.repository.findOne({
//       where: { _id: req.params.userId }
//     })
    
//     if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })
    
//     return res.json(user)
//   }

//   /**
//    * PUT /users
//    */
//   public async save(req: Request, res: Response) {
//     const user = await this.repository.save(req.body)

//     res.status(201)
//       .header('Location', `/users/${user._id}`)
//       .json(user)
//   }

//   /**
//    * PATCH /users/:user-_id
//    */
//   public async update(req: Request<{ userId: string }>, res: Response) {
//     const user = await this.repository.findOne({
//       where: { _id: req.params.userId }
//     })

//     if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

//     await this.repository.save(
//       this.repository.merge(user, req.body)
//     )

//     res.json(user)
//   }

//   /**
//    * DELETE /users/:user-_id
//    */
//   public async delete(req: Request<{ userId: string }>, res: Response) {
//     const user = await this.repository.findOne({
//       where: { _id: req.params.userId }
//     })

//     if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

//     await this.repository.softRemove(user)

//     res.json(user)
//   }
}
