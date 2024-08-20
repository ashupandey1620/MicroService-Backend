import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    backPhone: number;
    backEmail: string;
    isSuper: boolean;
    address: String;
    city: String;
    state: String;
    pinCode: String;
    designation: String;
    servingYear: Number;
    aCardNum: Number;
    pCardNum: Number;
    bankAccount: Number;
    ifscCode: String;
}

const userSchema = new Schema<IUser>(
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
        backPhone:{
            type: Number,
            required:false
        },
        backEmail:{
            type: String,
            required: false,
        },
        isSuper:{
            type: Boolean,
            required: true,
        }

    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
