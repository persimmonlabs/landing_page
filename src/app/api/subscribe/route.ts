import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'subscribers.json');

export async function POST(req: NextRequest) {
    try {
        const { email, locale = "EN" } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        const newSubscriber = {
            email,
            timestamp: new Date().toISOString(),
            locale,
        };

        // Log to console (persistent in Vercel logs)
        console.log("New Subscriber:", JSON.stringify(newSubscriber));

        // Attempt to save to local file (works locally, ephemeral on Vercel)
        let subscribers = [];
        if (fs.existsSync(FILE_PATH)) {
            try {
                const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
                subscribers = JSON.parse(fileContent);
            } catch (e) {
                // ignore error, start fresh
            }
        }
        subscribers.push(newSubscriber);
        fs.writeFileSync(FILE_PATH, JSON.stringify(subscribers, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
