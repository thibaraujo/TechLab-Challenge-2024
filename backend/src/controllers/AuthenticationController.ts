import { Request, Response } from "express";

import { IUser, User } from "../entities/User.js";
import jwt from 'jsonwebtoken'
import { APP_NAME, SECRET } from "../constants/env.js";
import { profiles } from "../constants/profiles.js";
import { UserModel } from "../model/user.js";


export class AuthenticationController {
  /**
   * POST /auth/sign-in
   */
  public async signIn(req: Request, res: Response) {
    console.log('signIn')
    if (typeof req.body !== 'object') throw new Error('Bad Request: body is required')

    if (typeof req.body.username !== 'string') throw new Error('Bad Request: body.username is required')

    if (typeof req.body.password !== 'string') throw new Error('Bad Request: body.password is required')

    const user = await UserModel.findOne({ email: req.body.email, deletedAt: null}).lean();
    console.log(user)
    if (!user) throw new Error('User not found')

    // if (user.password !== req.body.password) throw new Error('Invalid password')

    // const profile = profiles[user.profile as keyof typeof profiles]

    // const scopes = profile.scopes(user as IUser)
      
    // const accessToken = await new Promise<string>((resolve, reject) => {
    //   jwt.sign(
    //     { scopes: Array.isArray(scopes) ? scopes : [scopes] },
    //     SECRET,
    //     {
    //       audience: APP_NAME,
    //       issuer: APP_NAME,
    //       expiresIn: '1h',
    //       subject: `user:${user.id}`
    //     },
    //     (err, token) => {
    //       if (err) return reject(err)

    //       if (!token) return reject(new Error())

    //       resolve(token)
    //     }
    //   )
    // })

    // res.json({ access_token: accessToken, token_type: 'Bearer', expires_in: 3600 })
    res.json({ user })
  }
}
