import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  const API_KEY = process.env.PUBLIC_API_KEY;
  const apiKey = req.headers['x-api-key'];


  if (!token)
    return res.sendStatus(401).json({
      message: "Token Required",
    });
  console.log(token);

  if (!apiKey || apiKey == API_KEY) {
     next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err)
      return res.status(403).json({
        message: "Invalid Token",
      });
    console.log("Verified User: ", user);

    next();
  });
};
