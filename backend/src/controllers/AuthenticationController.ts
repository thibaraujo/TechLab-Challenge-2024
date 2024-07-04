import { Request, Response } from "express";
import authentication from "../services/authentication.js";
import { AuthUser } from "../interfaces/IAuthUser.js";


export class AuthenticationController {
  /**
   * POST /auth/sign-in
   */
  public async signIn(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(400).send("Authorization do header não encontrado");

    try {
      if (!req.ip) return res.status(400).send("IP não encontrado");
      const user = await authentication.auth(authorization, req.ip) as AuthUser;
      
      // Remove a senha do usuário
      user.password = "undefined";

      return res.status(200).set("Content-Type", "application/json").send(user as Omit<AuthUser, "password">);
    } catch (error) {
      console.error("ERRO INICIANDO SESSÃO DO USUÁRIO : ", error);
      return res.status(500).send(error);
    }
  }

  public async signInConsumer(req: Request, res: Response) {
    const document = req.body.document
    if (!document) return res.status(400).send("Documento não solicitado.");

    try {
      const consumer = await authentication.authConsumer(document);
      console.log(consumer);

      return res.status(200).set("Content-Type", "application/json").send(consumer);
    } catch (error) {
      console.error("ERRO INICIANDO SESSÃO DO USUÁRIO : ", error);
      return res.status(500).send(error);
    }
  }
}
