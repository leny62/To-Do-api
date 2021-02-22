import { verify } from 'jsonwebtoken';
require('dotenv').config();

export function requiredLogin(req, res, next) {
  const token = req.headers.authorization.replace('Bearer ', '');
  verify(token, 'thiIs', (err, decoded) => {
    if (err) {
      res.status(401).send({
        status: 401,
        message: 'please login first'
      });
    } else {
      req.userdata = decoded;
      next();
    }
  });
}
