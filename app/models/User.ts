import mongoose from "mongoose";

interface IUser {
  fullname: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  bio: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["مسؤول","مشرف","مستخدم"],
      default: "مستخدم",
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dgagbheuj/image/upload/v1763194734/avatar-default-image_yc4xy4.jpg"
    },
    bio: {
      type: String,
      default: "مرحباً بك"
    }
   
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
