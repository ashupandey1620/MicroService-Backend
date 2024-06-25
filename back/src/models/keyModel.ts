import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    apiKey: string;
    userId:mongoose.Schema.Types.ObjectId
}

const keySchema = new Schema<IUser>(
    {
        apiKey: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
);

const Key = mongoose.model<IUser>("Key", keySchema);
export default Key;
