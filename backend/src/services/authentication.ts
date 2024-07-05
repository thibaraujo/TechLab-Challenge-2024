import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Profile, User } from "../entities/User.js";
import { AuthUser } from "../interfaces/IAuthUser.js";
import { UserModel } from "../model/user.js";
import { CustomRequest } from "../interfaces/ICustomRequest.js";


const privateKey = process.env.SECRET ? process.env.SECRET : "SECRET_KEY";
const EXP_TIME = 1;

interface IToken {
  exp: number;
  iat?: number;
  user: User;
  ip: string;
}

class Authentication {

  static authentication: Authentication;
  static getInstance = function () {
    if (Authentication.authentication == undefined) {
      Authentication.authentication = new Authentication();
    }
    return Authentication.authentication;
  };

  generateJWT = function (user: User, ip: string) {
    const info = {
      user: user._id,
      email: user.email,
      exp: Date.now() + (EXP_TIME * 3600000),
      ip
    };
    return jwt.sign(info, privateKey);
  };

  updateJWT = function (info: IToken) {
    return jwt.sign(info, privateKey);
  };

  verifyJWT = function (req: Request, res: Response, next: any) {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) return res.status(401).send("Token de acesso não fornecido.");

      jwt.verify(token, privateKey, (err) => {
        if (err) return res.status(500).send("Falha ao autenticar o token.");

        next();
      });
    } else return res.status(401).send("Token de acesso não fornecida.");
  };

  // Autenticação unificada
  async auth(receivedToken: string, ip: string): Promise<AuthUser> {
    const [authentication, token] = receivedToken.split(" ");

    if (authentication == "Basic") return await this.basicAuth(token, ip);
    else if (authentication == "Bearer") return await this.bearerAuth(token, ip);
    else throw "Tipo de autenticação não reconhecido.";
  }

  // Autenticação Basic
  private async basicAuth(token: string, ip: string): Promise<AuthUser> {
    const [email, password] = token ? Buffer.from(token, "base64").toString().split(":") : [null, null];
    try {
      let user: AuthUser;

      // adicionando insensitive case
      let insensitiveEmail = "";
      if (email) insensitiveEmail = email.toLowerCase();

      const respUser: User | undefined = (await UserModel.findOne({ email: insensitiveEmail, deletedAt: null }).select("+password").exec())?.toObject();

      if (!respUser || !password || !respUser._id)
        throw "Usuário ou senha inválidos.";
      else user = respUser;

      if (!user.password) throw "Usuário não possui senha.";

      const hash = await bcrypt.compare(password, user.password);

      if (hash) {
        if (!user._id) throw "Usuário não possui _id.";

        return { ...user, token: this.generateJWT(user as User, ip) };
      }
      else throw "Senha incorreta.";

    } catch (err) {
      console.error(err);
      throw "Erro na autenticação Basic: " + err;
    }
  }

  private async bearerAuth(token: string, ip: string) {
    try {

      // Verifica o token
      const payload = jwt.verify(token, privateKey) as IToken;

      // Se a data não expirou e o ip não mudou
      if ((payload.exp > Date.now()) && (payload.ip == ip)) {
        payload.exp = Date.now() + (EXP_TIME * 3600000);
        delete payload.iat;

        // Busca o usuário no BD
        let user: AuthUser;
        const respUser: User | undefined = (await UserModel.findOne({ _id: payload.user, deletedAt: null }))?.toObject();

        if (!respUser) throw "Usuário ou senha inválidos.";
        else user = respUser;

        return { ...user, token: this.generateJWT(user, ip) };
      } else {
        throw "Token não reconhecido.";
      }
    } catch (err) {
      throw "Erro na autenticação Bearer: ";
    }
  }

  public standardMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) throw "Token de acesso não fornecido.";
      if (!req.ip) throw "IP não fornecido.";
      const user = await this.auth(req.headers.authorization, req.ip);

      delete user.token;
      req.user = user;

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send({ message: err });
    }
  };

  public sudoMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    await this.standardMiddleware(req, res, () => { return; });
    try {
      if (!(req.user?.profile == Profile.Sudo)) throw "Usuário não tem permissão para essa ação. Necessário perfil Sudo.";

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send(err);
    }
  };
}


export default Authentication.getInstance();