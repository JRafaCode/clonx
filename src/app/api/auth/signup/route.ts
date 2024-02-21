import {NextResponse} from "next/server";
import User from "@/models/user";
import {connectDB} from "@/libs/mongodb"
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(request: Request){
    const {MONGODB_URI} = process.env;
    const {fullname, email, password} = await request.json()
    console.log(fullname, email, password)

    if (!password || password.lenght < 6)
        return NextResponse.json(
        {
            message: "password must be at least 6 characters"
        },
        {
        status: 400
        }
    );

    try {
        await connectDB()
        const userFound = await User.findOne({email});
    
    if (userFound)
    return NextResponse.json(
        {
        message: "Email already exists",
        },
        {
        status: 409,
        }
    );

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
        email,
        fullname,
        password: hashedPassword,
    });
    const savedUser = await user.save()
    console.log(savedUser)
    
    return NextResponse.json(savedUser);

    } catch (error) {
        console.log(error)
        return NextResponse.error
    }
}