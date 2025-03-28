import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import Collection from "@/lib/models/Collection";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth(); // Await the auth() function

        if (!userId) {
            console.log("Unauthorized request: Missing userId");
            return new NextResponse("Unauthorized", { status: 403 });
        }

        await connectToDB();

        const { title, description, image } = await req.json();
        console.log("Received data:", { title, description, image }); // Debugging: Log request data

        if (!title || !image) {
            console.log("Validation failed: Missing title or image");
            return new NextResponse("Title and image are required", { status: 400 });
        }

        const existingCollection = await Collection.findOne({ title });

        if (existingCollection) {
            console.log("Duplicate collection:", title);
            return new NextResponse("Collection already exists", { status: 400 });
        }

        const newCollection = await Collection.create({
            title,
            description,
            image,
        });

        await newCollection.save()

        return NextResponse.json(newCollection, { status: 200 });

    } catch (err) {
        console.log("[collections_POST] Internal Server Error:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}