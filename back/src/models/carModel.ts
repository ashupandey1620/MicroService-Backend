import mongoose, { Document, Schema } from "mongoose";






/**
 *
 * Modelling the database document for Car Schema
 *
 */


export interface ICar extends Document {
    id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    images: string[];
    tags: {
        carType: string;
        company: string;
        dealer: string;
    };
    ownerId: mongoose.Schema.Types.ObjectId;
}


const carSchema = new Schema<ICar>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        tags: {
            carType: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true,
            },
            dealer: {
                type: String,
                required: true,
            },
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

const Car = mongoose.model<ICar>("Car", carSchema);
export default Car;
