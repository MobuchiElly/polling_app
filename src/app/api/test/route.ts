import {NextResponse} from "next/server";

export async function GET(){
    return NextResponse.json({message: "Tracking..."}, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}