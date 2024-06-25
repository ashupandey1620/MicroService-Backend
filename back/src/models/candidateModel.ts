import mongoose, { Document, Schema } from "mongoose";






/**
 *
 * Modelling the database document for
 *
 */


export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    userId: mongoose.Schema.Types.ObjectId;
}

const candidateSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

const Candidate = mongoose.model<IUser>("Candidate", candidateSchema);
export default Candidate;
