import mongoose, { Document, Schema } from "mongoose";

export interface IManagement extends Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    level: number;
    department: number;
}

const managementSchema = new Schema<IManagement>(
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
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        department:{
            type: Number,
            required: true,
        },
        level:{
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);

const ManagementUser = mongoose.model<IManagement>("ManagementTeam", managementSchema);
export default ManagementUser;
