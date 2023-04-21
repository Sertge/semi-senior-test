import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

// type encodedUser = {
//   id: number,
//   username: string
// }

export function authenticate (req: Request & { user: any}, res: Response, next: NextFunction) {
  const secretKey = process.env.JWT_KEY
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).send('Authorization header missing')
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, secretKey)
    req.user = decoded
    next()
  } catch (err) {
    console.error(err)
    res.status(401).send('Invalid Token')
  }
}