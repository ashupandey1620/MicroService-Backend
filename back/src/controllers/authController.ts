import User, { IUser } from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import KeyModel from "../models/keyModel";



interface User {
  email: string;
  passwordHash: string;
}

interface ApiKeyMap {
  [email: string]: string;
}
const API_KEY_SECRET = process.env.API_KEY_SECRET || ""

/**
 *
 * REGISTER Controller helps in registering a user after taking its data from the user
 *
 */
export const register = async (req: Request, res: Response) => {


  const { firstName, lastName, email, password } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (isUser)
      return res.status(400).json({
        message: "User already exists",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      message: "User Registration Successful",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



/**
 *
 * Login Controller provides help in logging in a user on the basis of its credentials
 * it provide back the ACCESS TOKEN and the REFRESH TOKEN back to the user
 *
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User not found",
      });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    res.status(200).json({
      message: "Login Successful",
      accessToken: accessToken,
      refreshToken: refreshToken,

    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


/**
 *
 * REFRESH TOKEN is used to get a new ACCESS TOKEN from the server
 * It gives the response with a new ACCESS TOKEN
 */

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken)
      return res.status(400).json({
        message: "Refresh Token Required",
      });
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, user: any) => {
        if (err)
          return res.status(403).json({
            message: "Invalid Refresh Token",
          });
        const accessToken = generateAccessToken(user.id);
        res.status(200).json({
          accessToken: accessToken,
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


/**
 *
 * getApiKey Controller is used to get the api keys generated for a particular user id it exist in the USER TABLE
 * of the DATABASE
 *
 * The Generated API_KEY is send to the user as a response and also saved at the KEY TABLE with USER ID
 *
 */


export const getApiKey = async (req: Request, res: Response) => {

  try{
    const { email, password } = req.body;
    console.log(`Email ${email}`)
    console.log(`password ${password}`)

    const user = await User.findOne({ email });
    console.log(`User ${user}`)

    if (!user)
      return res.status(400).json({
        message: "User not found",
      });

    const valid = await bcrypt.compare(password, user.password);
    console.log(`Valid ${valid}`)
    if (!valid)
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    let userID = user.id;

    console.log(userID)
    const keyPresent = await KeyModel.findOne({ userId: userID });

    console.log(`Key Present ${keyPresent}`)

    let apiKey = ""
    if (!keyPresent) {
      //UserId is already present in the Key Database, So don't need to generate it again
       apiKey = jwt.sign({email: user.email}, API_KEY_SECRET, {expiresIn: '30d'});

      const key = new KeyModel({
            apiKey,
            userId: user.id,
          }
      );

      console.log(key);
      const savedKey = await key.save();

    }
    else{
       apiKey = keyPresent.apiKey;
    }

    res.json({ apiKey });
  }
  catch(error){
    res.status(500).json({message: error});
  }
}


