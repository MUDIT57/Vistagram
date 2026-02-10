import { NextResponse } from "next/server";

export async function POST(request:Request) {
    const {image_url}= await request.json();
    const response=await fetch("http://localhost:8000/caption",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({image_url:image_url})
    })
    const data=await response.json();
    return NextResponse.json({caption:data.caption,success:true});
}