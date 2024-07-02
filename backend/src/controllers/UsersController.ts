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

//   /**
//    * GET /users/:user-id
//    */
//   public async findOne(req: Request<{ userId: string }>, res: Response) {
//     const user = await this.repository.findOne({
//       where: { id: req.params.userId }
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
//       .header('Location', `/users/${user.id}`)
//       .json(user)
//   }

//   /**
//    * PATCH /users/:user-id
//    */
//   public async update(req: Request<{ userId: string }>, res: Response) {
//     const user = await this.repository.findOne({
//       where: { id: req.params.userId }
//     })

//     if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

//     await this.repository.save(
//       this.repository.merge(user, req.body)
//     )

//     res.json(user)
//   }

//   /**
//    * DELETE /users/:user-id
//    */
//   public async delete(req: Request<{ userId: string }>, res: Response) {
//     const user = await this.repository.findOne({
//       where: { id: req.params.userId }
//     })

//     if (!user) return res.status(404).json({ message: `Not found User with ID ${req.params.userId}` })

//     await this.repository.softRemove(user)

//     res.json(user)
//   }
}
