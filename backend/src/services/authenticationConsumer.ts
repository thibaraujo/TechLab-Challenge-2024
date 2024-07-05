import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Consumer } from "../entities/Consumer.js";
import { ConsumerModel } from "../model/Consumer.js";
import { AuthConsumer } from "../interfaces/IAuthConsumer.js";
import { CustomRequest } from "../interfaces/ICustomRequest.js";
import { IToken } from "../interfaces/IToken.js";


const privateKey = process.env.SECRET ? process.env.SECRET : "SECRET_KEY";
const EXP_TIME = 1;


class AuthenticationConsumer {

  static authentication: AuthenticationConsumer;
  static getInstance = function () {
    if (AuthenticationConsumer.authentication == undefined) {
        AuthenticationConsumer.authentication = new AuthenticationConsumer();
    }
    return AuthenticationConsumer.authentication;
  };

  generateJWTConsumer = function (consumer: Consumer, ip: string) {
    const info = {
      consumer: consumer._id,
      exp: Date.now() + (EXP_TIME * 3600000),
      ip
    };
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

  // Autenticação Consumer
  async authConsumer(document: string): Promise<AuthConsumer> {
    try {
      let consumer: any
      // adicionando insensitive case
      let insensitiveDocument = "";
      if (document) insensitiveDocument = document.toLowerCase();
      const respConsumer: Consumer | undefined = (await ConsumerModel.findOne({ document: insensitiveDocument, deletedAt: null}).exec())?.toObject();

      if (!respConsumer || !respConsumer._id)
        throw "Consumidor não encontrado.";
      else consumer = respConsumer;

      console.log(consumer);
      return { ...consumer, token: this.generateJWTConsumer(consumer as Consumer, "") };
    } catch (err) {
      console.error(err);
      throw "Erro na autenticação Consumer: " + err;
    }
  }

  async bearerAuthConsumer(receivedToken: string) {
    try {
      const [authentication, token] = receivedToken.split(" ");
      const consumer = jwt.verify(token, privateKey) as IToken;
      if (!consumer) throw "Token inválido.";

      const respConsumer: Consumer | undefined = (await ConsumerModel.findOne({
        deletedAt: null, 
        _id: consumer.consumer
      }).exec())?.toObject();

      if(!respConsumer) throw "Consumidor não encontrado.";
      if(consumer.exp < Date.now()) throw "Token expirado.";

      return { ...respConsumer, token: this.generateJWTConsumer(respConsumer as Consumer, "" )};
    } catch (err) {
      console.error(err);
      throw "Erro na autenticação Consumer: " + err;
    }
  }

  public consumerMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) throw "Documento não fornecido.";
      const consumer = await this.bearerAuthConsumer(req.headers.authorization) as any;
      if (!consumer) throw "Consumidor não encontrado.";

      req.consumer = consumer._id;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send({ message: err });
    }
  }

}

export default AuthenticationConsumer.getInstance();