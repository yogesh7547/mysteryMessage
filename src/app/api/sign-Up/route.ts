import dbconnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User.model";
import bycrypt from "bcryptjs";

import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";




export async function POST(request: Request) {
    await dbconnect();

    try {

        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {

            return Response.json(
                {
                    success: true,
                    message: "Username is already taken"
                },
                { status: 400 }
            );
        }


        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User with this email already exists with this email."
                    },
                    { status: 400 }
                )
            } else {
                const hashedPassword = await bycrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

                await existingUserByEmail.save();

            }

        } else {
            const hashedPassword = await bycrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                messages: []

            })

            await newUser.save();

        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                }
                , { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Verification email sent."
            }
            , { status: 201 }
        );


    } catch (error) {
        console.error("Error registering user :", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        );
    }
}



// db connection at every route is required : becoz , the server connection might have died due to inactivity. 
//why the connection dies : The "server process dies" because cloud providers (like Vercel or AWS) don't want to charge you for a computer that is doing nothing. They kill the process to save money and resources,



//algo for this route:

/* if (existing user) {
    if (existing user is verified) {
        return response that this username or email is taken
    }else {
      verify that user thru otp and allow them to update their password
    }
}else {
   create new user and verify it thru otp
}

send verification email  */