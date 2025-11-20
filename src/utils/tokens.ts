import { IUSER } from "../models/user.model"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const signAccessToken = (user: IUSER): string => {
  return jwt.sign({ sub: user._id.toString(), roles: user.roles }, JWT_SECRET, {
    expiresIn: "30m"
  })
}
