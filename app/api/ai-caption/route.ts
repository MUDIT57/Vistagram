import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { image_url } = await request.json();
    try {
        const response = await fetch("http://localhost:8000/caption", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ image_url: image_url })
        });
        const data = await response.json();
        if (!data.success) {
            return NextResponse.json({ success: false, error: data.error ?? "Caption generation failed" }, { status: 500 });
        }
        return NextResponse.json({ caption: data.caption, success: true });
    } catch {
        return NextResponse.json({ success: false, error: "Caption service is not running" }, { status: 503 });
    }
}
