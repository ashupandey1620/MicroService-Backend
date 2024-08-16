import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: number;
  backPhone: number;
  backEmail: string;
  isSuper: boolean;
}

const adminSchema = new Schema<IAdmin>(
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

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;