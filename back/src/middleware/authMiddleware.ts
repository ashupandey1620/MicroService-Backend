import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

/**
 *
 * MIddleware to check whether the provided Access token is valid or not
 * User is valid on not on the basis of the headers provided
 */


export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  console.log(token)

  if (!token)
    return res.sendStatus(401).json({
      message: "Token Required",
    });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    console.log("User: ", user);
    if (err)
      return res.status(403).json({
        message: "Invalid Token",
      });
    console.log("Verified User: ", user);

    req.userId = (user as { id: string }).id;

    next();
  });
};
