
import { Request, Response } from "express";
import CandidateModel from "../models/carModel";
import Candidate from "../models/carModel";
import UserModel from "../models/UserModel";

import User from "../models/UserModel";

import { generateRandomPassword } from '../utils/generatePassword';
import nodemailer from 'nodemailer';
import Admin from "../models/UserModel";
import Car from "../models/carModel";





/**
 *
 * ADD CANDIDATE CONTROLLER is used to add a candidate in the database
 * Candidate is added with respect to its owner
 *
 */

const addCar = async (req: Request, res: Response) => {

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

        const isUser = await User.findOne({ email });
        if (isUser)
            return res.status(400).json({
                message: `Management User with same Email Id already exist with name ${isUser.fullname}`,
            });



        // console.log("Entered thr try block");

        const car = new Car({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            level,
            department
        });

        console.log(car);
        await car.save();

        res.status(201).json({
            "message":"Car Added Successfully",
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


/**
 *
 * DELETE candidate deletes the particular candidate from the database table on the basis of the
 * userID provided in the param
 *
 */
const deleteCar = async (req: Request, res: Response) => {

    try {
        const deletedCandidate = await Car.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Management Person deleted successfully",
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
const deleteAllCar = async (req: Request, res:Response) => {
    try {
        const deleteResult = await CandidateModel.deleteMany({});
        res.status(200).json({
            message: `${deleteResult.deletedCount} Management Person from the database has been deleted`
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

const getAllCar = async (req: Request, res: Response) => {
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





export default {
    addCar,
    deleteCar,
    deleteAllCar,
    getAllCar,
};