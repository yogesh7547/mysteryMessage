import mongoose, { Schema, Document } from "mongoose";


//MESSAGE MODEL
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});



//USER MODEL
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
    createdAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        default: false,
    },
    messages:[MessageSchema],

    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});


const userModel= (mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("user", UserSchema)

export default userModel;

//extends Document basically tells TypeScript: "This interface is not just a plain data object; it is a Mongoose Database Object. therfore it contains all the properties and methods that Mongoose adds to its documents, such as save(), remove(), and so on."


//mongoose.models.User: This checks Mongoose's internal cache to see if the 'User' model is already initialized.

//mongoose.model<User>("user", UserSchema): This creates the new model if one didn't exist.



//Why are we doing this

//Without this check, every time you save a file, Next.js re-runs your code. Mongoose will try to create the model named "user" again. Mongoose does not allow this; it throws an error saying:
// OverwriteModelError: Cannot overwrite 'User' model once compiled.
// By adding this check, you prevent your app from crashing every time you save a file.


//as mongoose.Model<User>: When you grab mongoose.models.User from the cache, TypeScript doesn't know what that object looks like—it just treats it as any. By asserting its type with as mongoose.Model<User>, you inform TypeScript about the structure of the model, enabling better type checking and autocompletion when you use userModel elsewhere in your code.