
import { Request, Response } from "express";
import CandidateModel from "../models/candidateModel";
import Candidate from "../models/candidateModel";
import UserModel from "../models/userModel";
import KeyModel from "../models/keyModel";
import User from "../models/userModel";
import Key from "../models/keyModel";
import jwt from "jsonwebtoken";
import {generateAccessToken} from "../utils/token";


/**
 *
 * ADD CANDIDATE CONTROLLER is used to add a candidate in the database
 * Candidate is added with respect to its owner
 *
 */

const addCandidate = async (req: Request, res: Response) => {

    const userId = req.userId;
    console.log(`User is ${userId}`);

    const {
        firstName,
        lastName,
        email
    } = req.body;


    try {
        console.log("Entered thr try block");
        const candidate = new CandidateModel({
            firstName,
            lastName,
            email,
            userId
        });

        console.log(candidate);

        await candidate.save();

        res.status(201).json({
            "message":"Candidate Added successfully",
            "status":"success"
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

interface Candidate {
    firstName: string;
    lastName: string;
    email: string;
}


/**
 *
 * ADD  MANY CANDIDATE CONTROLLER is used to add a list of candidate data in the database at once
 * Candidates are added with respect to its owner
 * userId field is added to the each candidate
 */

const addManyCandidate = async (req: Request, res: Response) => {
    const userId = req.userId;
    const candidates: Candidate[] = req.body; // Assuming the body contains an array of card objects
    try {
        console.log(`user ID ${userId}`);
        console.log(`Candidates are  ${candidates}`);

        const candidatesWithUserId = candidates.map(candidate => ({
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            userId: userId // Assuming userId is extracted from req.userId
        }));
        console.log(candidatesWithUserId);
        const savedCandidates = await CandidateModel.insertMany(candidatesWithUserId);
        res.status(201).json({
            message: "Candidates added successfully",
            status: "success",
            data: savedCandidates
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};



/**
 *
 * DELETE candidate deletes the particular candidate from the database table on the basis of the
 * userID provided in the param
 *
 */
const deleteCandidate = async (req: Request, res: Response) => {

    try {
        const deletedCandidate = await CandidateModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Candidate deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}


/**
 *
 * DELETE ALL CANDIDATES deletes all the candidates entry from the mongodb CANDIDATE DOCUMENT COLLECTION
 *
 */
const deleteAllCandidate = async (req: Request, res:Response) => {
    try {
        const deleteResult = await CandidateModel.deleteMany({});
        res.status(200).json({
            message: `${deleteResult.deletedCount} Candidates deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

/**
 *
 * It returns all the Candidates formed by the USER calling the API Request to the database
 * IT returns the candidate list after checking the USER HEADER for its userID
 */

const getAllCandidate = async (req: Request, res: Response) => {
    const user = req.userId;
    try{
        const candidates=await CandidateModel.find({ userId: user });
        res.status(200).json({
            "message":"All Candidates fetched Successfully",
            "properties":candidates,
            "status":"success"
        });
    }
    catch(error){
        res.status(500).json({message: error});
    }
}


/**
 *
 * It provides the profile of the user who made a request to the server
 * it provides the profile on the basis of the header authorization
 *
 */

const getUserProfile = async (req: Request, res: Response) => {
    const user = req.userId;
    try{
        const profile=await UserModel.find({ userId: user });
        res.status(200).json({
            "profile":"User Profile fetched Successfully",
            "properties":profile,
            "status":"success"
        });
    }
    catch(error){
        res.status(500).json({message: error});
    }
}



/**
 *
 * It provides the profile of the user who made a request to the server
 * it provides the profile on the basis of the header authorization
 *
 */

const getUserProfilePublic = async (req: Request, res: Response) => {

    const {
        apiKey
    } = req.body;

    try{
        const keyDocument = await Key.findOne({ apiKey: apiKey });

        if (!keyDocument) {
             return res.status(404).json({ message: "Invalid Api Key" });
        }

        let userId = keyDocument!!.userId.toString()

        // console.log(userId)

        const profile=await User.findById(userId).select("-password");

        if (!profile) {
            return res.status(404).json({ message: "Internal Server Error : PID 5534" });
        }
        console.log(profile)

        res.status(200).json({
            "profile":"User Profile fetched Successfully",
            "properties":profile,
            "status":"success"
        });
    }
    catch(error){
        res.status(500).json({message: error});
    }
}


/**
 *
 * it provides the profile on the basis of the header authorization
 * It returns all the Candidates formed by the USER calling the API Request to the database
 * IT returns the candidate list after checking the USER HEADER for its userID
 */

const getAllCandidatesPublic = async (req: Request, res: Response) => {


    const api_auth = req.headers[`apikey`];
    console.log(api_auth)
    try{
        const document=await KeyModel.findOne({ apiKey: api_auth });

        console.log(document)

        let userId = document!!.userId.toString()

        console.log(userId)

        const candidates=await CandidateModel.find({ userId: userId });

        console.log(candidates)

        res.status(200).json({
            "message":"All Candidates fetched Successfully",
            "properties":candidates,
            "status":"success"
        });
    }
    catch(error){
        res.status(500).json({message: error});
    }
}

export const protectedFun = async (req: Request, res: Response) => {

    try {
        res.status(200).json({
            "message":"You are Authorised to call this API Endpoint",
            "status":"success"
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
};



export default {
    addCandidate,
    addManyCandidate,
    deleteCandidate,
    deleteAllCandidate,
    getAllCandidate,
    getUserProfile,
    getUserProfilePublic,
    getAllCandidatesPublic,
    protectedFun
};