import User, { IUser } from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import axios from "axios";

const MAIN_SERVICE_URL =  process.env.MAIN_SERVICE_URL

/**
 *
 * getApiKey Controller is used to get the api keys generated for a particular user id it exist in the USER TABLE
 * of the DATABASE
 *
 * The Generated API_KEY is send to the user as a response and also saved at the KEY TABLE with USER ID
 *
 */
export const getApiKey = async (req: Request, res: Response) => {
  const user = req.userId;
  const { email, password } = req.body;

  try{

    const response = await axios.post(`${MAIN_SERVICE_URL}/api/getApiKey`, { email, password });

    const { apiKey } = response.data;

    if(!response){
      res.status(400).json({
        error:true,
        message:"Email or Password is incorrect"
      });
    }

    return res.status(response.status).json({
      error:false,
      apiKey:apiKey,
      message:"This is your API key",
    });
  }
  catch(error){
    res.status(500).json({message: error});
  }
}


/**
 *
 * PROFILE CONTROLLER provides the profile of the User on the basis of the API_KEY provided in header
 * from the MAIN SERVICE DATABASE to the PUBLIC SERVICE SERVER
 * as a response for the request made by the PUBLIC SERVER to the MAIN SERVER
 *
 */

export const profile = async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"];
  console.log(apiKey)
  try {
    const response = await axios.post(`${MAIN_SERVICE_URL}/api/public/profile`, { apiKey });

    res.status(200).json({
      "message":"User Profile fetched Successfully",
      "properties":response.data.properties,
      "status":"success"
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


/**
 *
 * CANDIDATE CONTROLLER provides the list of all the Candidates formed by the respective user
 * on the basis of the API_KEY header provided to server in requst
 *
 */
export const candidate = async (req: Request, res: Response) => {
  // console.log(req);  // This should log your API key
  const apiAuth = req.headers['apikey'];
  console.log(apiAuth);  // This should log your API key

  try{
    const response = await axios.get(`${MAIN_SERVICE_URL}/api/public/candidate`,
        {
          headers: {
            'apikey': apiAuth
          }
        });

    res.status(200).json({
      "message":"All Candidates fetched Successfully",
      "properties":response.data.properties,
      "status":"success"
    });
  }
  catch(error){
    res.status(500).json({message: error});
  }
}
