import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  apiKey: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const apiSchema = new Schema<IUser>(
  {
    apiKey: {
      type: String,
      required: true,
    },
    userId: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

const ApiUser = mongoose.model<IUser>("Api_User", apiSchema);
export default ApiUser;
