
import { Request, Response } from "express";
import CandidateModel from "../models/candidateModel";
import Candidate from "../models/candidateModel";
import UserModel from "../models/adminUserModel";
import KeyModel from "../models/keyModel";
import User from "../models/adminUserModel";
import Key from "../models/keyModel";
import ManagementUserModel from "../models/managementUserModel";
import { generateRandomPassword } from '../utils/generatePassword';
import nodemailer from 'nodemailer';
import Admin from "../models/adminUserModel";
import ManagementUser from "../models/managementUserModel";



/**
 *
 * ADD CANDIDATE CONTROLLER is used to add a candidate in the database
 * Candidate is added with respect to its owner
 *
 */

const addCandidate = async (req: Request, res: Response) => {

    const userId = req.userId;
    console.log(` Management User is ${userId}`);

    const {
        firstName,
        lastName,
        email,
        phone,
        address,
        level,
        department
    } = req.body;

    // Generate a random password
    const password = generateRandomPassword();


    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Enter Proper Email ID, EmailID not in Format",
            });
        }

        const isUser = await ManagementUser.findOne({ email });
        if (isUser)
            return res.status(400).json({
                message: `Management User with same Email Id already exist with name ${isUser.firstName} ${isUser.lastName}`,
            });



        // console.log("Entered thr try block");

        const managementUser = new ManagementUserModel({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            level,
            department
        });

        console.log(managementUser);

        await managementUser.save();


        // Set up the nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            // secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: `"Admin" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your Account Has Been Created',
            text: `Hello ${firstName} ${lastName} ,\n\nYour account has been created. Your password is: ${password}\n\nPlease change your password after logging in.`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({
            "message":"Management Person Added successfully, and mail is send to him",
            "status":"success"
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}



/**
 *
 * ADD  MANY CANDIDATE CONTROLLER is used to add a list of candidate data in the database at once
 * Candidates are added with respect to its owner
 * userId field is added to the each candidate
 */

interface Candidate {
    firstName: string;
    lastName: string;
    email: string;
}


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